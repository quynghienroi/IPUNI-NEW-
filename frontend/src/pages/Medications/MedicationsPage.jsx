import { useEffect } from 'react';
import { Pill } from 'lucide-react';
import { useMedications } from '../../hooks/useMedications';
import { useT } from '../../hooks/useT';
import MedicationCard from '../../components/medications/MedicationCard';
import EmptyState from '../../components/common/EmptyState';
import styles from './MedicationsPage.module.css';

export default function MedicationsPage() {
  const { medications, loading, fetchMedications } = useMedications();
  const t = useT();

  useEffect(() => { fetchMedications(); }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t.medications.title}</h1>
      <p className={styles.subtitle}>{t.medications.subtitle}</p>

      {loading ? null : medications.length === 0 ? (
        <EmptyState
          icon={Pill}
          title={t.medications.noMeds}
          subtitle={t.medications.noMedsSubtitle}
        />
      ) : (
        <div className={styles.list}>
          {medications.map((m) => <MedicationCard key={m.id} medication={m} />)}
        </div>
      )}
    </div>
  );
}
