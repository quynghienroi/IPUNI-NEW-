const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middlewares/auth.middleware');
const { sendSuccess } = require('../../utils/response.helper');
const { getProfile, updateProfile } = require('./users.service');

router.use(authMiddleware);
router.get('/profile', async (req, res, next) => {
  try { sendSuccess(res, await getProfile(req.user.id)); } catch (err) { next(err); }
});
router.put('/profile', async (req, res, next) => {
  try { sendSuccess(res, await updateProfile(req.user.id, req.body)); } catch (err) { next(err); }
});

module.exports = router;
