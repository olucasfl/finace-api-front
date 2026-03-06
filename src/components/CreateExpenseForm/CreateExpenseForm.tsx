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
  const [date, setDate] = useState("");

  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !amount || !category || !paymentMethod) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    await createExpense(budgetId, {
      title,
      amount: Number(amount),
      category,
      paymentMethod,
      expenseDate: date || undefined,
    });

    setTitle("");
    setAmount("");
    setDate("");
    setCategory("");
    setPaymentMethod("");

    onCreated();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>

      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="number"
        placeholder="Valor"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Categoria</option>
        <option value="FOOD">Alimentação</option>
        <option value="TRANSPORT">Transporte</option>
        <option value="ENTERTAINMENT">Lazer</option>
        <option value="HEALTH">Saúde</option>
        <option value="BILLS">Contas</option>
        <option value="EDUCATION">Educação</option>
        <option value="TRAVEL">Viagem</option>
        <option value="RENT">Aluguel</option>
        <option value="SHOPPING">Compras</option>
        <option value="INVESTMENTS">Investimentos</option>
        <option value="SUBSCRIPTIONS">Assinaturas</option>
        <option value="OTHER">Outro</option>
      </select>

      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="">Método de pagamento</option>
        <option value="PIX">Pix</option>
        <option value="CREDIT">Crédito</option>
        <option value="DEBIT">Débito</option>
        <option value="CASH">Dinheiro</option>
        <option value="TRANSFER">Transferência</option>
        <option value="OTHER">Outro</option>
      </select>

      <button type="submit">
        Adicionar
      </button>

    </form>
  );
}