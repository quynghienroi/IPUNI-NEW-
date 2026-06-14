const path = require('path');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Anthropic = require('@anthropic-ai/sdk');

const DIABETES_KEYWORDS = [
  'metformin', 'glucophage', 'diamet', 'tiaphage', 'gluformin', 'glucofast',
  'glibenclamide', 'daonil', 'maninil', 'glibenhexal',
  'gliclazide', 'diamicron', 'predian',
  'glimepiride', 'amaryl', 'glimet', 'glimpi', 'glimestar',
  'glipizide', 'minidiab',
  'insulin', 'mixtard', 'lantus', 'novomix', 'novorapid', 'humulin', 'humalog', 'levemir',
  'sitagliptin', 'januvia',
  'vildagliptin', 'galvus',
  'saxagliptin', 'onglyza',
  'linagliptin', 'trajenta',
  'alogliptin', 'nesina',
  'empagliflozin', 'jardiance',
  'dapagliflozin', 'forxiga',
  'canagliflozin', 'invokana',
  'pioglitazone', 'actos',
  'acarbose', 'glucobay',
  'liraglutide', 'victoza',
  'semaglutide', 'ozempic',
  'dulaglutide', 'trulicity',
  'exenatide', 'byetta',
];

function isDiabetesDrug(name) {
  const lower = (name || '').toLowerCase();
  return DIABETES_KEYWORDS.some(k => lower.includes(k));
}

const PROMPT = `Convert OCR text to JSON. All Vietnamese values must be direct, short, no filler words.
If isDiabetesPrescription is false, set medications to [].

JSON Schema:
{
  "isPrescription": true/false,
  "isDiabetesPrescription": true/false (true if diagnosis or medication is for diabetes),
  "rejectionReason": "reason in Vietnamese" or null,
  "doctorName": "name" or null,
  "prescriptionDate": "YYYY-MM-DD" or null,
  "diagnosis": "diagnosis" or null,
  "doctorNotes": "doctor instructions" or null,
  "medications": [{
    "name": "drug name only",
    "dosage": "dosage",
    "quantity": "quantity" or null,
    "amountPerDose": "amount per dose",
    "timesPerDay": times_per_day_number,
    "frequency": "frequency",
    "times": ["HH:MM"] (Map: Sáng->07:00, Trưa->12:00, Chiều->15:00, Tối->19:00, Trước ngủ->22:00),
    "instructions": "instructions",
    "isDiabetesDrug": true/false,
    "detail": {
      "purpose": "drug purpose",
      "mechanism": "how it works",
      "sideEffects": "side effects",
      "source": "ADA/Mayo Clinic/Vinmec/MedlinePlus"
    }
  }]
}`;

function shapeResult(parsed) {
  const isPrescription = parsed.isPrescription !== false;
  const medications = parsed.medications || [];

  const keywordDiabetes = medications.some(m => isDiabetesDrug(m.name));
  const isDiabetesPrescription =
    parsed.isDiabetesPrescription === true || (parsed.isDiabetesPrescription == null && keywordDiabetes);

  const diabetesDrugs = medications
    .filter(m => m.isDiabetesDrug === true || isDiabetesDrug(m.name))
    .map(m => m.name);

  return {
    isPrescription,
    isDiabetesPrescription,
    rejectionReason: parsed.rejectionReason || null,
    medications: isDiabetesPrescription ? medications : [],
    hasDiabetesDrugs: diabetesDrugs.length > 0,
    diabetesDrugs,
    doctorName: parsed.doctorName || null,
    prescriptionDate: parsed.prescriptionDate || null,
    diagnosis: parsed.diagnosis || null,
    doctorNotes: parsed.doctorNotes || parsed.notes || null,
    error: parsed.error || null,
  };
}

const logger = require('../../utils/logger');

function parseAiJson(text) {
  let cleaned = text.trim();
  
  // 1. Tìm cặp dấu ngoặc {} đầu tiên và cuối cùng
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.substring(start, end + 1);
  }

  // 2. Loại bỏ các comment thường gặp
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, ''); // /* ... */
  cleaned = cleaned.replace(/(?:^|[^:])\/\/.*$/gm, ''); // // ...

  // 3. Loại bỏ dấu phẩy thừa trước dấu đóng ngoặc nhọn hoặc ngoặc vuông
  cleaned = cleaned.replace(/,(\s*[\]}])/g, '$1');

  // 4. Thử parse trực tiếp
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    logger.warn("First JSON parse failed. Attempting to repair...");
  }

  // 5. Khắc phục các lỗi cú pháp JSON phổ biến của LLM nhỏ
  try {
    let repaired = cleaned;
    
    // Sửa dấu nháy đơn thành nháy kép cho các thuộc tính và giá trị
    repaired = repaired.replace(/'([^'\r\n]+)'\s*:/g, '"$1":'); // 'key': -> "key":
    repaired = repaired.replace(/:\s*'([^'\r\n]+)'/g, ': "$1"'); // : 'val' -> : "val"
    
    // Tự động thêm dấu nháy kép cho các key không có nháy kép (vd: isPrescription: -> "isPrescription":)
    repaired = repaired.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');

    // Thêm các dấu phẩy bị thiếu giữa các thuộc tính phân dòng
    repaired = repaired.replace(/"\s*(\r?\n)\s*"/g, '",$1"');

    // Escaping các ký tự xuống dòng hoặc tab nằm bên trong chuỗi giá trị nháy kép
    repaired = repaired.replace(/"([^"]*)"/g, (match, p1) => {
      return '"' + p1.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t') + '"';
    });

    return JSON.parse(repaired);
  } catch (repairError) {
    logger.error("JSON Repair failed. Raw text from AI: " + text, repairError);
    logger.error("Attempted clean text: " + cleaned);
    throw repairError;
  }
}

// Using Tesseract OCR and LLM (Gemini/Claude/Ollama) for AI analysis
async function analyzePrescription(imageBuffer, mimeType) {
  const tessdataDir = path.join(__dirname, '../../../database/tessdata');
  if (!fs.existsSync(tessdataDir)) {
    fs.mkdirSync(tessdataDir, { recursive: true });
  }

  let ocrText = '';
  try {
    logger.info("[Quét đơn thuốc] Đang trích xuất chữ từ ảnh bằng Tesseract OCR...");
    const ocrResult = await Tesseract.recognize(
      imageBuffer,
      'vie+eng',
      {
        cachePath: tessdataDir,
        logger: m => {
          if (m.status === 'recognizing text' && Math.round(m.progress * 100) % 25 === 0) {
            logger.info(`[Tesseract OCR] Tiến trình: ${Math.round(m.progress * 100)}%`);
          }
        }
      }
    );
    ocrText = ocrResult.data.text || '';
    logger.info(`[Quét đơn thuốc] Trích xuất hoàn tất. Kích thước văn bản: ${ocrText.length} ký tự.`);
  } catch (ocrError) {
    logger.error("[Quét đơn thuốc] Lỗi khi nhận diện chữ bằng Tesseract OCR: " + ocrError.message);
  }


  let text = '';
  
  // 1. Dùng Gemini nếu có API Key (Khuyên dùng để đạt độ chính xác 100%)
  if (process.env.GEMINI_API_KEY) {
    try {
      const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
      logger.info(`[Quét đơn thuốc] Phát hiện GEMINI_API_KEY. Đang phân tích bằng Google Gemini (${modelName})...`);
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: { responseMimeType: 'application/json' }
      });

      const prompt = `${PROMPT}
      
Dữ liệu chữ trích xuất từ Tesseract OCR cần phân tích và sắp xếp thành cấu trúc JSON:
---
${ocrText}
---`;

      // Tuyệt đối không gửi ảnh (imageBuffer) để tiết kiệm tối đa băng thông và token
      const result = await model.generateContent([prompt]);
      text = result.response.text();
    } catch (geminiError) {
      logger.error("[Quét đơn thuốc] Lỗi khi gọi Gemini API: " + geminiError.message, geminiError);
    }
  }
  
  // 2. Dùng Anthropic Claude nếu có API Key
  if (!text && process.env.ANTHROPIC_API_KEY) {
    try {
      logger.info("[Quét đơn thuốc] Phát hiện ANTHROPIC_API_KEY. Đang phân tích bằng Anthropic Claude...");
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      
      const prompt = `${PROMPT}
      
Dữ liệu chữ trích xuất từ Tesseract OCR cần phân tích và sắp xếp thành cấu trúc JSON:
---
${ocrText}
---`;

      // Tuyệt đối không gửi ảnh để tiết kiệm tối đa băng thông và token
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });
      text = response.content[0].text;
    } catch (claudeError) {
      logger.error("[Quét đơn thuốc] Lỗi khi gọi Anthropic API: " + claudeError.message, claudeError);
    }
  }

  // 3. Nếu không có API Key nào được cấu hình
  if (!text) {
    throw new Error('Vui lòng cấu hình GEMINI_API_KEY trong file backend/.env để thực hiện quét đơn thuốc.');
  }

  logger.info(`[Quét đơn thuốc] Kích thước nội dung phản hồi từ AI: ${text.length} ký tự.`);
  
  logger.info("[Quét đơn thuốc] Đang tiến hành bóc tách và phân tích cú pháp JSON...");
  let parsed = parseAiJson(text);
  
  logger.info("[Quét đơn thuốc] Đang chuẩn hóa cấu trúc dữ liệu đơn thuốc (medications, chẩn đoán, bác sĩ)...");
  const result = shapeResult(parsed);
  
  logger.info("[Quét đơn thuốc] Phân tích đơn thuốc hoàn tất thành công!");
  return result;
}

module.exports = { analyzePrescription, shapeResult, parseAiJson, isDiabetesDrug };
