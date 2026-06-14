import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useThemeStore from '../../store/themeStore';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import TermsModal from '../../components/common/TermsModal';
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
  const { register, completeRegistration } = useAuth();
  const navigate = useNavigate();
  const applyDefaultLook = useThemeStore((s) => s.applyDefaultLook);
  const [form, setForm] = useState({ cccd: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [pendingAuth, setPendingAuth] = useState(null);

  // Trang ngoài luôn dùng giao diện mặc định
  useEffect(() => { applyDefaultLook(); }, [applyDefaultLook]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!/^\d{12}$/.test(form.cccd)) errs.cccd = 'CCCD phải đúng 12 chữ số';
    if (!/^\d{9,11}$/.test(form.phone)) errs.phone = 'Số điện thoại không hợp lệ';
    if (form.password.length < 6) errs.password = 'Mật khẩu ít nhất 6 ký tự';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Mật khẩu nhập lại không khớp';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setServerError('');
    setLoading(true);
    try {
      const authData = await register(form.cccd, form.phone, form.password, form.confirmPassword);
      setPendingAuth(authData);
      setShowTerms(true);
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <img src="/logo-moi.png" alt="DIA+ Logo" style={{ width: '260px', height: 'auto', objectFit: 'contain', mixBlendMode: 'multiply' }} />
          <div className={styles.tagline}>Nền tảng Y tế DIA+<br />Quản lý sức khoẻ toàn diện</div>
        </div>

        <div className={styles.card}>
          <h1 className={styles.title}>Đăng ký</h1>
          <p className={styles.subtitle}>Nhập thông tin để tạo tài khoản</p>

          {serverError && <div className={styles.errorMsg}>{serverError}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <Input
                label="Số CCCD"
                type="text"
                inputMode="numeric"
                maxLength={12}
                placeholder="123456789012"
                value={form.cccd}
                onChange={set('cccd')}
              />
              {errors.cccd && <span className={styles.fieldError}>{errors.cccd}</span>}
            </div>

            <div className={styles.field}>
              <Input
                label="Số điện thoại"
                type="text"
                inputMode="numeric"
                maxLength={11}
                placeholder="0901234567"
                value={form.phone}
                onChange={set('phone')}
              />
              {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
            </div>

            <div className={styles.field}>
              <Input
                label="Mật khẩu"
                type="password"
                placeholder="••••••"
                value={form.password}
                onChange={set('password')}
              />
              {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
            </div>

            <div className={styles.field}>
              <Input
                label="Nhập lại mật khẩu"
                type="password"
                placeholder="••••••"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
              />
              {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}
            </div>

            <Button type="submit" full disabled={loading} style={{ marginTop: '8px', backgroundColor: '#00A693' }}>
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
          </form>

          <div className={styles.loginLink}>
            Đã có tài khoản?{' '}
            <Link to="/login" className={styles.link}>Đăng nhập ngay</Link>
          </div>
        </div>

        <div className={styles.footer}>
          DIA+ · Giải pháp y tế thông minh
        </div>
      </div>

      {showTerms && <TermsModal onComplete={() => {
        if (pendingAuth) {
          completeRegistration(pendingAuth.token, pendingAuth.user);
          navigate('/');
        }
      }} />}
    </div>
  );
}
