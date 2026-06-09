import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { METRIC_TYPES } from '../../constants/metrics';
import { useT } from '../../hooks/useT';
import styles from './AddMetricModal.module.css';

function nowLocalISO() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return {
    date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    time: `${pad(now.getHours())}:${pad(now.getMinutes())}`
  };
}

export default function AddMetricModal({ onClose, onSave, onSuccess, defaultType }) {
  const { date, time } = nowLocalISO();
  const t = useT();
  const [type, setType] = useState(defaultType || 'fasting');
  const [value, setValue] = useState('');
  const [measuredDate, setMeasuredDate] = useState(date);
  const [measuredTime, setMeasuredTime] = useState(time);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const num = parseFloat(value);
    if (!value || isNaN(num) || num < 0.1 || num > 50) {
      setError(t.addMetric.invalidValue);
      return;
    }
    setError('');
    setSaving(true);
    try {
      const measured_at = new Date(`${measuredDate}T${measuredTime}:00`).toISOString();
      await onSave({ type, value: num, measured_at, note: note.trim() || undefined });
      onSuccess?.();
      onClose();
    } catch (e) {
      setError(e?.response?.data?.message || t.addMetric.errorGeneric);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={t.addMetric.title} onClose={onClose}>
      <div className={styles.group}>
        <label className={styles.label}>{t.addMetric.typeLabel}</label>
        <select className={styles.select} value={type} onChange={(e) => setType(e.target.value)}>
          {Object.entries(t.metrics.types).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>{t.addMetric.valueLabel}</label>
        <div className={styles.valueRow}>
          <input
            className={styles.input}
            type="number"
            step="0.1"
            min="0.1"
            max="50"
            placeholder={t.addMetric.valuePlaceholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <span className={styles.unit}>mmol/L</span>
        </div>
        {error && <div className={styles.error}>{error}</div>}
      </div>

      <div className={styles.group}>
        <label className={styles.label}>{t.addMetric.timeLabel}</label>
        <div className={styles.dateRow}>
          <input className={styles.input} type="date" value={measuredDate} onChange={(e) => setMeasuredDate(e.target.value)} />
          <input className={styles.input} type="time" value={measuredTime} onChange={(e) => setMeasuredTime(e.target.value)} />
        </div>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>{t.addMetric.noteLabel}</label>
        <textarea className={styles.textarea} placeholder={t.addMetric.notePlaceholder} value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      <Button full onClick={handleSave} disabled={saving}>
        {saving ? t.addMetric.saving : t.addMetric.saveBtn}
      </Button>
    </Modal>
  );
}
