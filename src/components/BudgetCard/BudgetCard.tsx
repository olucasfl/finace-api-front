import styles from "./BudgetCard.module.css";

type Props = {
  id: string;
  name: string;
  limit: number;
  totalSpent: number;
  remaining: number;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

export default function BudgetCard({
  id,
  name,
  limit,
  totalSpent,
  remaining,
  onDelete,
  onEdit,
}: Props) {
  const percentage =
    limit > 0 ? Math.min((totalSpent / limit) * 100, 100) : 0;

  return (
    <div className={`${styles.card} glass`}>
      <div className={styles.header}>
        <h2>{name}</h2>
        <div className={styles.actions}>
          <button onClick={() => onEdit(id)}>✏️</button>
          <button onClick={() => onDelete(id)}>🗑️</button>
        </div>
      </div>

      <div className={styles.amount}>
        R$ {remaining.toFixed(2)}
      </div>

      <div className={styles.meta}>
        Limite: R$ {limit.toFixed(2)} • Usado: {percentage.toFixed(1)}%
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}