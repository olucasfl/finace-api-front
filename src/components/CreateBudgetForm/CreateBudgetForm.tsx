import { useState } from "react";
import styles from "./CreateBudgetForm.module.css";
import { createBudget } from "../../services/budgetsService";

type Props = {
  onCreated: () => void;
};

export default function CreateBudgetForm({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !limit) return;

    try {
      setLoading(true);
      await createBudget({
        name,
        limit: Number(limit),
      });

      setName("");
      setLimit("");
      onCreated();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome do budget"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Limite"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Criando..." : "Criar Budget"}
      </button>
    </form>
  );
}