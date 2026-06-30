import { useT } from '../../hooks/useT';
import styles from './StatisticsCard.module.css';

export default function StatisticsCard({ statistics, estimatedHbA1c }) {
  const t = useT();

  if (!statistics) {
    return (
      <div className={styles.card}>
        <p className={styles.empty}>{t.metrics?.noData || 'No data'}</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.title}>{t.metrics?.statisticsTitle || 'Statistics'}</div>

      <div className={styles.grid}>
        <div className={styles.stat}>
          <span className={styles.label}>{t.metrics?.average || 'Average'}</span>
          <span className={styles.value}>{statistics.average}</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.label}>{t.metrics?.minimum || 'Min'}</span>
          <span className={styles.value}>{statistics.minimum}</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.label}>{t.metrics?.maximum || 'Max'}</span>
          <span className={styles.value}>{statistics.maximum}</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.label}>{t.metrics?.readingCount || 'Count'}</span>
          <span className={styles.value}>{statistics.count}</span>
        </div>
      </div>

      {estimatedHbA1c && (
        <div className={styles.estimated}>
          <span className={styles.label}>{t.metrics?.estimatedHbA1c || 'Est. HbA1c'}</span>
          <span className={styles.hba1c}>{estimatedHbA1c}%</span>
          <span className={styles.note}>
            {t.metrics?.estimatedNote || '(±15-20% accuracy)'}
          </span>
        </div>
      )}
    </div>
  );
}
