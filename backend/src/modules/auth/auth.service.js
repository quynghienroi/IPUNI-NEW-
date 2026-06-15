const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/database');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../../config/constants');

function signToken(user) {
  return jwt.sign(
    { id: user.id, cccd: user.cccd, phone: user.phone, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

async function login(identifier, password) {
  let user = await db('users').where({ email: identifier }).first();
  if (!user) user = await db('users').where({ cccd: identifier }).first();
  if (!user) throw { status: 401, message: 'Thông tin đăng nhập không đúng' };

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw { status: 401, message: 'Thông tin đăng nhập không đúng' };

  const token = signToken(user);
  return { token, user: { id: user.id, user_code: user.user_code, name: user.name, address: user.address, cccd: user.cccd, phone: user.phone, diagnosis: user.diagnosis, plan: user.plan } };
}

function genUserCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'DIA';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function register(cccd, phone, password) {
  const existingCccd = await db('users').where({ cccd }).first();
  if (existingCccd) throw { status: 409, message: 'CCCD đã được đăng ký' };

  const existingPhone = await db('users').where({ phone }).first();
  if (existingPhone) throw { status: 409, message: 'Số điện thoại đã được đăng ký' };

  const password_hash = await bcrypt.hash(password, 10);
  let user_code;
  do { user_code = genUserCode(); } while (await db('users').where({ user_code }).first());
  const [id] = await db('users').insert({ cccd, phone, password_hash, user_code });
  const user = await db('users').where({ id }).first();

  const token = signToken(user);
  return { token, user: { id: user.id, user_code: user.user_code, address: user.address, cccd: user.cccd, phone: user.phone, diagnosis: user.diagnosis } };
}

async function getMe(userId) {
  const user = await db('users').where({ id: userId }).first();
  if (!user) throw { status: 404, message: 'Người dùng không tồn tại' };
  return {
    id: user.id, user_code: user.user_code, name: user.name, email: user.email,
    address: user.address, cccd: user.cccd, phone: user.phone,
    date_of_birth: user.date_of_birth, blood_type: user.blood_type,
    allergies: user.allergies, insurance_number: user.insurance_number,
    insurance_expiry: user.insurance_expiry,
    diagnosis: user.diagnosis, plan: user.plan, created_at: user.created_at,
  };
}

async function googleMock(email) {
  let user = await db('users').where({ email }).first();
  if (!user) {
    let user_code;
    do { user_code = genUserCode(); } while (await db('users').where({ user_code }).first());
    
    // Tạo user mới với mật khẩu mặc định (vì đăng nhập Google không cần pass)
    const password_hash = await bcrypt.hash('google_oauth_mock', 10);
    const [id] = await db('users').insert({ 
      email, 
      name: email.split('@')[0], // Lấy phần đầu email làm tên
      password_hash, 
      user_code,
      cccd: 'GG' + Math.floor(Math.random() * 1000000000), // Mock CCCD
      phone: '09' + Math.floor(Math.random() * 100000000)  // Mock Phone
    });
    user = await db('users').where({ id }).first();
  }

  const token = signToken(user);
  return { token, user: { id: user.id, user_code: user.user_code, name: user.name, address: user.address, email: user.email, cccd: user.cccd, phone: user.phone, diagnosis: user.diagnosis, plan: user.plan } };
}

module.exports = { login, register, getMe, googleMock };
