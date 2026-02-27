import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import BudgetCard from "../../components/BudgetCard/BudgetCard";
import {
  getBudgets,
  deleteBudget,
} from "../../services/budgetsService"

type Budget = {
  id: string;
  name: string;
  limit: number;
  totalSpent: number;
  remaining: number;
};

export default function Dashboard() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [error, setError] = useState("");

  async function loadBudgets() {
    try {
      const data = await getBudgets();
      setBudgets(data);
    } catch {
      setError("Erro ao carregar budgets");
    }
  }

  useEffect(() => {
    loadBudgets();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Deseja realmente apagar este budget?")) return;

    await deleteBudget(id);
    loadBudgets();
  }

  function handleEdit(id: string) {
    alert("Editar budget: " + id);
  }

  if (error) {
    return <div style={{ padding: 40 }}>{error}</div>;
  }

  return (
    <div className="page-container">
      <h1 className={styles.title}>Budgets</h1>

      <div className={styles.grid}>
        {budgets.map((budget) => (
          <BudgetCard
            key={budget.id}
            id={budget.id}
            name={budget.name}
            limit={budget.limit}
            totalSpent={budget.totalSpent}
            remaining={budget.remaining}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
}