const svc = require('./scan.service');
const { sendSuccess, sendError } = require('../../utils/response.helper');

async function analyzePrescription(req, res, next) {
  try {
    if (!req.file) return sendError(res, 'Vui lòng chọn ảnh đơn thuốc', 400);
    const result = await svc.analyzePrescription(req.file.buffer, req.file.mimetype);
    sendSuccess(res, result, 'Phân tích đơn thuốc thành công');
  } catch (err) {
    if (err.status) return sendError(res, err.message, err.status);
    next(err);
  }
}

module.exports = { analyzePrescription };
