import { useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Pill, User, Calendar, FileText, Lock, Crown } from 'lucide-react';
import { scanService } from '../services/scan.service';
import { medicationsService } from '../services/medications.service';
import { useMedications } from '../hooks/useMedications';
import { useToast } from '../hooks/useToast';
import { usePlan } from '../hooks/usePlan';
import UpgradeModal from '../components/layout/UpgradeModal';
import ScanCamera from '../components/scan/ScanCamera';
import styles from './ScanPrescriptionPage.module.css';

export default function ScanPrescriptionPage() {
  const { isFree } = usePlan();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { fetchMedications } = useMedications();
  const { showToast } = useToast();
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [savedIndices, setSavedIndices] = useState(new Set());
  const [savingIndex, setSavingIndex] = useState(null);

  const handleImageScan = useCallback((file) => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setResult(null);
    setSavedIndices(new Set());
  }, [imageUrl]);

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) return;
    setIsAnalyzing(true);
    try {
      const res = await scanService.analyzePrescription(imageFile);
      setResult(res.data.data);
      if (res.data.data.error) {
        showToast(res.data.data.error, 'error');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Lỗi kết nối đến server';
      showToast(msg, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageFile, showToast]);

  const handleSaveOne = useCallback(async (med, index) => {
    setSavingIndex(index);
    try {
      await medicationsService.create({
        name: med.name,
        dosage: med.dosage || 'Theo chỉ định',
        frequency: med.frequency || 'Theo chỉ định bác sĩ',
        times: med.times && med.times.length > 0 ? med.times : ['07:00'],
        instructions: med.instructions || '',
        doctor_name: result?.doctorName || med.doctor_name || '',
        prescribed_at: result?.prescriptionDate || new Date().toISOString().split('T')[0],
        is_active: 1,
      });
      setSavedIndices(prev => new Set([...prev, index]));
      showToast(`Đã thêm ${med.name}`, 'success');
      fetchMedications();
    } catch {
      showToast('Lỗi khi lưu thuốc', 'error');
    } finally {
      setSavingIndex(null);
    }
  }, [result, fetchMedications, showToast]);

  const handleRetake = useCallback(() => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageFile(null);
    setImageUrl(null);
    setResult(null);
    setSavedIndices(new Set());
  }, [imageUrl]);

  if (isFree) {
    return (
      <>
        <div className={styles.lockedPage}>
          <div className={styles.lockedIcon}>
            <Lock size={36} />
          </div>
          <h2 className={styles.lockedTitle}>Tính năng Pro</h2>
          <p className={styles.lockedDesc}>
            Quét đơn thuốc bằng AI chỉ dành cho tài khoản <strong>Pro</strong> trở lên.
          </p>
          <div className={styles.lockedFeatures}>
            <span>✓ Nhận diện thuốc tự động</span>
            <span>✓ Lưu trực tiếp vào danh sách</span>
            <span>✓ Hỗ trợ tiếng Việt</span>
          </div>
          <button className={styles.lockedBtn} onClick={() => setShowUpgrade(true)}>
            <Crown size={16} />
            Nâng cấp Pro
          </button>
        </div>
        {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      </>
    );
  }

  if (isAnalyzing) {
    return (
      <div className={styles.scanningOverlay}>
        <div className={styles.scanningContent}>
          <div className={styles.scanningSpinner} />
          <p>Claude AI đang phân tích đơn thuốc...</p>
          <span className={styles.scanningHint}>Thường mất 5–15 giây</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Quét Đơn Thuốc</h1>
        <p>Chụp ảnh đơn thuốc để tự động nhận diện và lưu thuốc</p>
      </div>

      {!imageUrl ? (
        <ScanCamera onImageScan={handleImageScan} />
      ) : (
        <>
          <div className={styles.imagePreview}>
            <img src={imageUrl} alt="Đơn thuốc" />
            <div className={styles.imageActions}>
              {!result && (
                <button onClick={handleAnalyze} className={styles.analyzeBtn}>
                  Phân Tích Đơn Thuốc
                </button>
              )}
              <button onClick={handleRetake} className={styles.retakeBtn}>
                Chụp lại
              </button>
            </div>
          </div>

          {result && (
            <div className={styles.results}>
              {result.hasDiabetesDrugs && (
                <div className={styles.diabetesBanner}>
                  <AlertCircle size={20} />
                  <div>
                    <strong>Phát hiện thuốc điều trị tiểu đường</strong>
                    <p>{result.diabetesDrugs.join(', ')}</p>
                  </div>
                </div>
              )}

              {(result.doctorName || result.prescriptionDate) && (
                <div className={styles.metaRow}>
                  {result.doctorName && (
                    <span className={styles.metaChip}>
                      <User size={13} /> {result.doctorName}
                    </span>
                  )}
                  {result.prescriptionDate && (
                    <span className={styles.metaChip}>
                      <Calendar size={13} /> {result.prescriptionDate}
                    </span>
                  )}
                </div>
              )}

              {result.medications.length === 0 && !result.error && (
                <div className={styles.emptyResult}>
                  <FileText size={32} />
                  <p>Không tìm thấy thuốc trong ảnh. Vui lòng thử ảnh rõ hơn.</p>
                </div>
              )}

              {result.medications.length > 0 && (
                <div className={styles.medicationsList}>
                  <h2>
                    <Pill size={16} />
                    {result.medications.length} thuốc được nhận diện
                  </h2>
                  {result.medications.map((med, i) => {
                    const saved = savedIndices.has(i);
                    const saving = savingIndex === i;
                    return (
                      <div key={i} className={`${styles.medCard} ${saved ? styles.medCardSaved : ''}`}>
                        <div className={styles.medHeader}>
                          <span className={styles.medName}>{med.name}</span>
                          {med.dosage && <span className={styles.medDosage}>{med.dosage}</span>}
                        </div>
                        {med.frequency && (
                          <div className={styles.medDetail}>
                            <span className={styles.detailLabel}>Tần suất</span>
                            <span>{med.frequency}</span>
                          </div>
                        )}
                        {med.times && med.times.length > 0 && (
                          <div className={styles.medDetail}>
                            <span className={styles.detailLabel}>Thời điểm</span>
                            <span>{med.times.join(', ')}</span>
                          </div>
                        )}
                        {med.instructions && (
                          <div className={styles.medDetail}>
                            <span className={styles.detailLabel}>Cách dùng</span>
                            <span>{med.instructions}</span>
                          </div>
                        )}
                        <button
                          className={saved ? styles.savedBtn : styles.addBtn}
                          onClick={() => !saved && handleSaveOne(med, i)}
                          disabled={saved || saving}
                        >
                          {saving ? 'Đang lưu...' : saved ? (
                            <><CheckCircle size={15} /> Đã thêm</>
                          ) : 'Thêm vào danh sách thuốc'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <button onClick={handleRetake} className={styles.scanAgainBtn}>
                Quét đơn thuốc khác
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
