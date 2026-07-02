import { create } from 'zustand';

const SCALE_KEY = 'diaplus-font-scale';

function getStoredLevel() {
  const v = parseFloat(localStorage.getItem(SCALE_KEY));
  return !isNaN(v) && v >= 1 && v <= 2 ? v : 1;
}

function applyScale(factor) {
  // zoom phóng to + reflow theo bề rộng viewport nên không tràn ngang
  document.documentElement.style.zoom = factor;
  localStorage.setItem(SCALE_KEY, String(factor));
}

const useAccessibilityStore = create((set) => {
  const level = getStoredLevel();
  applyScale(level);

  return {
    fontScale: level,
    setFontScale: (level) =>
      set(() => {
        const clamped = Math.min(2, Math.max(1, level));
        applyScale(clamped);
        return { fontScale: clamped };
      }),
  };
});

export default useAccessibilityStore;
