import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, Settings, LogOut, Crown, Palette, Globe } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePlan } from '../../hooks/usePlan';
import { useT } from '../../hooks/useT';
import useLangStore from '../../store/langStore';

const LANG_FLAGS = [
  { code: 'vi', img: 'https://flagcdn.com/w40/vn.png', label: 'Tiếng Việt' },
  { code: 'en', img: 'https://flagcdn.com/w40/gb.png', label: 'English' },
  { code: 'lo', img: 'https://flagcdn.com/w40/la.png', label: 'ພາສາລາວ' },
];
import UserProfileModal from './UserProfileModal';
import SettingsModal from './SettingsModal';
import UpgradeModal from './UpgradeModal';
import GiaoDienModal from './GiaoDienModal';
import styles from './UserMenu.module.css';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const { isPro } = usePlan();
  const t = useT();
  const { lang, setLang } = useLangStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showGiaoDien, setShowGiaoDien] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && buttonRef.current &&
          !menuRef.current.contains(e.target) &&
          !buttonRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleProfile = () => {
    setShowProfile(true);
    setIsOpen(false);
  };

  const handleSettings = () => {
    setShowSettings(true);
    setIsOpen(false);
  };

  const handleUpgrade = () => {
    setShowUpgrade(true);
    setIsOpen(false);
  };

  const handleGiaoDien = () => {
    setShowGiaoDien(true);
    setIsOpen(false);
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <>
      <button
        ref={buttonRef}
        className={styles.userBtn}
        onClick={handleToggle}
        title={user?.name || 'User'}
      >
        <div className={`${styles.avatar} ${isPro ? styles.avatarPro : ''}`}>
          {getInitials(user?.name)}
        </div>
        {isPro && <Crown size={11} className={styles.proCrown} />}
      </button>

      {isOpen && createPortal(
        <div
          ref={menuRef}
          className={styles.menu}
          style={{ top: menuPos.top, right: menuPos.right }}
        >
          <button className={`${styles.menuItem} ${styles.upgradeItem}`} onClick={handleUpgrade}>
            <Crown size={16} />
            <span>{t.userMenu.upgrade}</span>
            <span className={styles.upgradeBadge}>PRO</span>
          </button>
          <div className={styles.menuDivider} />
          <button className={styles.menuItem} onClick={handleProfile}>
            <User size={18} />
            <span>{t.userMenu.profile}</span>
          </button>
          <div className={styles.langRow}>
            <Globe size={15} className={styles.langIcon} />
            <span className={styles.langRowLabel}>{t.userMenu.language || 'Ngôn ngữ'}</span>
            <div className={styles.langFlags}>
              {LANG_FLAGS.map(({ code, img, label }) => (
                <button
                  key={code}
                  className={`${styles.langFlagBtn} ${lang === code ? styles.langFlagActive : ''}`}
                  onClick={() => setLang(code)}
                  title={label}
                >
                  <img src={img} alt={label} className={styles.langFlagImg} />
                </button>
              ))}
            </div>
          </div>
          {isPro && (
            <button className={`${styles.menuItem} ${styles.giaoDienItem}`} onClick={handleGiaoDien}>
              <Palette size={18} />
              <span>{t.userMenu.theme}</span>
            </button>
          )}
          <button className={styles.menuItem} onClick={handleSettings}>
            <Settings size={18} />
            <span>{t.userMenu.settings}</span>
          </button>
          <button className={`${styles.menuItem} ${styles.logout}`} onClick={handleLogout}>
            <LogOut size={18} />
            <span>{t.userMenu.logout}</span>
          </button>
        </div>,
        document.body
      )}

      {showProfile && (
        <UserProfileModal onClose={() => setShowProfile(false)} />
      )}

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}

      {showUpgrade && (
        <UpgradeModal onClose={() => setShowUpgrade(false)} />
      )}

      {showGiaoDien && (
        <GiaoDienModal onClose={() => setShowGiaoDien(false)} />
      )}
    </>
  );
}
