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

async function analyzePrescription(imageBuffer, mimeType) {
  if (!process.env.ANTHROPIC_API_KEY) {
    const err = new Error('ANTHROPIC_API_KEY chưa được cấu hình trong file .env');
    err.status = 503;
    throw err;
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: mimeType,
            data: imageBuffer.toString('base64'),
          },
        },
        {
          type: 'text',
          text: `Phân tích đơn thuốc Việt Nam trong ảnh này. Trích xuất tất cả thông tin thuốc.

Trả về JSON hợp lệ, KHÔNG có text nào khác ngoài JSON:
{
  "medications": [
    {
      "name": "tên thuốc (chỉ tên, không kèm liều lượng)",
      "dosage": "liều lượng (ví dụ: 500mg, 1 viên)",
      "frequency": "tần suất (ví dụ: 2 lần/ngày, ngày 1 lần)",
      "times": ["07:00"],
      "instructions": "cách dùng (trước ăn / sau ăn / v.v.)",
      "doctor_name": null
    }
  ],
  "doctorName": "tên bác sĩ nếu đọc được hoặc null",
  "prescriptionDate": "YYYY-MM-DD hoặc null",
  "notes": "ghi chú nếu có hoặc null"
}

Quy tắc trường "times" (mảng giờ HH:MM):
- Buổi sáng → "07:00"
- Buổi trưa → "12:00"
- Buổi chiều → "15:00"
- Buổi tối → "19:00"
- Trước ngủ / buổi đêm → "22:00"
- Nếu không rõ → []

Nếu ảnh quá mờ hoặc không phải đơn thuốc, trả về: {"medications":[],"error":"Không thể đọc ảnh đơn thuốc"}`,
        },
      ],
    }],
  });

  let parsed;
  try {
    const text = response.content[0].text.trim();
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    parsed = JSON.parse(jsonMatch ? jsonMatch[1].trim() : text);
  } catch {
    return { medications: [], hasDiabetesDrugs: false, diabetesDrugs: [], error: 'Không thể phân tích kết quả' };
  }

  const medications = parsed.medications || [];
  const diabetesDrugs = medications.filter(m => isDiabetesDrug(m.name)).map(m => m.name);

  return {
    medications,
    hasDiabetesDrugs: diabetesDrugs.length > 0,
    diabetesDrugs,
    doctorName: parsed.doctorName || null,
    prescriptionDate: parsed.prescriptionDate || null,
    notes: parsed.notes || null,
    error: parsed.error || null,
  };
}

module.exports = { analyzePrescription };
