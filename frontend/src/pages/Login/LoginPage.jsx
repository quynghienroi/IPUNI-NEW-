import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useT } from '../../hooks/useT';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const t = useT();
  const [identifier, setIdentifier] = useState('khoi@example.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      <div className={styles.logoSection}>
        <div className={styles.logoIcon}><Activity size={36} color="#fff" strokeWidth={2.5} /></div>
        <div className={styles.logoName}>DIA+</div>
        <div className={styles.tagline}>{t.auth.taglineLogin.replace('\\n', '\n')}</div>
      </div>

      <div className={styles.card}>
        <h1 className={styles.title}>{t.auth.loginTitle}</h1>
        <p className={styles.subtitle}>{t.auth.loginSubtitle}</p>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input label={t.auth.identifierLabel} type="text" placeholder={t.auth.identifierPlaceholder} value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
          <Input label={t.auth.passwordLabel} type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" full disabled={loading}>
            {loading ? t.auth.loggingIn : t.auth.loginBtn}
          </Button>
        </form>

        <div className={styles.registerLink}>
          {t.auth.noAccount}{' '}
          <Link to="/register" className={styles.link}>{t.auth.registerLink}</Link>
        </div>
      </div>

      <div className={styles.footer}>
        DIA+ · {t.auth.tagline}
      </div>
    </div>
  );
}
