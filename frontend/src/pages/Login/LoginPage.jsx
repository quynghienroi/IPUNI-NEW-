import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useThemeStore from '../../store/themeStore';
import { useT } from '../../hooks/useT';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { PhoneIcon, GoogleIcon } from '../../components/common/AuthIcons';
import ImageCarousel from '../../components/common/ImageCarousel';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const t = useT();
  const applyDefaultLook = useThemeStore((s) => s.applyDefaultLook);
  
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [identifier, setIdentifier] = useState('khoi@example.com');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Trang ngoài luôn dùng giao diện mặc định
  useEffect(() => { applyDefaultLook(); }, [applyDefaultLook]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) { setError(t.auth.fillAll); return; }
    setError('');
    setLoading(true);
    try {
      await login(identifier, password);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || t.auth.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.carouselSection}>
          <ImageCarousel images={['/dashboard_cute.png']} />
        </div>

        <div className={styles.textContent}>
          <h1 className={styles.mainTitle}>Nền tảng Y tế DIA+</h1>
          <p className={styles.mainSubtitle}>
            Giải pháp toàn diện quản lý bệnh lý,<br />dinh dưỡng và vận động
          </p>
        </div>

        {!showEmailForm ? (
          <div className={styles.buttonGroup}>
            <button className={`${styles.authButton} ${styles.phoneBtn}`}>
              <PhoneIcon className={styles.icon} />
              <span>Đăng nhập qua số điện thoại</span>
            </button>
            <button className={`${styles.authButton} ${styles.googleBtn}`}>
              <GoogleIcon className={styles.icon} />
              <span>Đăng nhập qua Google</span>
            </button>
            
            <div className={styles.fallbackLogin}>
              <span onClick={() => setShowEmailForm(true)} className={styles.linkText}>
                Đăng nhập bằng Email/Mật khẩu
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.emailFormContainer}>
            <h2 className={styles.emailTitle}>{t.auth.loginTitle}</h2>
            {error && <div className={styles.errorMsg}>{error}</div>}
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input label={t.auth.identifierLabel} type="text" placeholder={t.auth.identifierPlaceholder} value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
              <Input label={t.auth.passwordLabel} type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button type="submit" full disabled={loading}>
                {loading ? t.auth.loggingIn : t.auth.loginBtn}
              </Button>
            </form>
            <div className={styles.fallbackLogin}>
               <span onClick={() => setShowEmailForm(false)} className={styles.linkText}>
                Quay lại
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
