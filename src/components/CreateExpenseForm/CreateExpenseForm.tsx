import { useState } from "react";
import styles from "./CreateExpenseForm.module.css";
import { createExpense } from "../../services/expensesService";

type Props = {
  budgetId: string;
  onCreated: () => void;
};

export default function CreateExpenseForm({
  budgetId,
  onCreated,
}: Props) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !amount) return;

    await createExpense(budgetId, {
      title,
      amount: Number(amount),
    });

    setTitle("");
    setAmount("");
    onCreated();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        id="expense-title"
        name="expense-title"
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        id="expense-amount"
        name="expense-amount"
        type="number"
        placeholder="Valor"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button type="submit">Adicionar</button>
    </form>
  );
}