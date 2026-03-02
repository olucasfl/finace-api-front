import styles from "./BudgetCard.module.css";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const percentage =
    limit > 0 ? Math.min((totalSpent / limit) * 100, 100) : 0;

  return (
    <div
      className={`${styles.card} glass`}
      onClick={() => navigate(`/budgets/${id}`)}
    >
      <div className={styles.header}>
        <h2>{name}</h2>
        <div
          className={styles.actions}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => onEdit(id)}>✏️</button>
          <button onClick={() => onDelete(id)}>🗑️</button>
        </div>
      </div>

      <div className={styles.amount}>
        R$ {Number(remaining ?? 0).toFixed(2)}
      </div>

      <div className={styles.meta}>
        Limite: R$ {limit.toFixed(2)} • Usado:{" "}
        {percentage.toFixed(1)}%
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