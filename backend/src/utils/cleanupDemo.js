const db = require('../config/database');
const logger = require('./logger');

async function cleanupExpiredDemos() {
  try {
    // 30 minutes in milliseconds
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    
    // Find users where email starts with demo_ and created_at < 30 mins ago
    const expiredUsers = await db('users')
      .where('email', 'like', 'demo_%@ipuni.com')
      .andWhere('created_at', '<', thirtyMinutesAgo)
      .select('id', 'email');

    if (!expiredUsers || expiredUsers.length === 0) {
      return; 
    }

    const userIds = expiredUsers.map(u => u.id);
    logger.info(`[Cleanup] Bắt đầu dọn dẹp ${userIds.length} tài khoản demo hết hạn.`);

    // Delete child records first to respect FK constraints
    await db('metrics').whereIn('user_id', userIds).del();
    await db('medications').whereIn('user_id', userIds).del();
    await db('appointments').whereIn('user_id', userIds).del();
    
    const hasScanUsages = await db.schema.hasTable('scan_usages');
    if (hasScanUsages) {
      await db('scan_usages').whereIn('user_id', userIds).del();
    }
    
    // Delete the users
    await db('users').whereIn('id', userIds).del();
    
    logger.info(`[Cleanup] Dọn dẹp thành công ${userIds.length} tài khoản demo.`);
  } catch (error) {
    logger.error(`[Cleanup] Lỗi dọn dẹp tài khoản demo: ${error.message}`);
  }
}

module.exports = { cleanupExpiredDemos };
