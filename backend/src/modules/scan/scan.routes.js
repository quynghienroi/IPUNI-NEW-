const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('./scan.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Chỉ hỗ trợ file ảnh'), false);
  },
});

router.use(authMiddleware);
router.post('/prescription', upload.single('image'), controller.analyzePrescription);

module.exports = router;
