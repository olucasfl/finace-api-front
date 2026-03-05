import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./BudgetDetails.module.css";
import api from "../../services/api";
import {
  getExpenses,
  deleteExpense,
  updateExpense,
  createExpense
} from "../../services/expensesService";
import type { Expense } from "../../services/expensesService";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";

type Budget = {
  id: string;
  name: string;
  limit: number;
  totalSpent: number;
  remaining: number;
};

export default function BudgetDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [budget, setBudget] = useState<Budget | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const [editingExpense, setEditingExpense] =
    useState<Expense | null>(null);

  async function loadBudget() {
    const response = await api.get(`/budgets/${id}`);
    setBudget(response.data);
  }

  async function loadExpenses() {
    const data = await getExpenses(id!);
    setExpenses(data);
  }

  useEffect(() => {
    loadBudget();
    loadExpenses();
  }, [id]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !amount) return;

    await createExpense(id!, {
      title,
      amount: Number(amount),
      expenseDate: date || undefined
    });

    setTitle("");
    setAmount("");
    setDate("");

    loadBudget();
    loadExpenses();
  }

  if (!budget) return <div>Carregando...</div>;

  const percentage =
    budget.limit > 0
      ? Math.min((budget.totalSpent / budget.limit) * 100, 100)
      : 0;

  return (
    <div className={styles.container}>

      <div className={styles.topButtons}>
        <ThemeToggle />
      </div>

      <button
        className={styles.backButton}
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft size={18} />
        Voltar
      </button>

      <h1 className={styles.title}>{budget.name}</h1>

      {/* SUMMARY */}

      <div className={styles.summaryWrapper}>
        <div className={styles.summary}>
          <div>
            <span>Limite</span>
            <h3>R$ {budget.limit.toFixed(2)}</h3>
          </div>

          <div>
            <span>Total gasto</span>
            <h3>R$ {budget.totalSpent.toFixed(2)}</h3>
          </div>

          <div>
            <span>Restante</span>
            <h3>R$ {budget.remaining.toFixed(2)}</h3>
          </div>
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* CREATE EXPENSE */}

      <div className={styles.section}>
        <h2>Adicionar gasto</h2>

        <form
          className={styles.form}
          onSubmit={handleCreate}
        >

          <input
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Valor"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <div className={styles.inputWrapper}>

            <label>Data (opcional)</label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

          </div>

          <button type="submit">
            Adicionar
          </button>

        </form>
      </div>

      {/* EXPENSE LIST */}

      <div className={styles.expenseList}>
        {expenses.map((expense) => (

          <div
            key={expense.id}
            className={styles.expenseItem}
          >

            <div>
              <div className={styles.expenseTitle}>
                {expense.title}
              </div>

              <div className={styles.expenseDate}>
                {new Date(
                  expense.expenseDate
                ).toLocaleDateString("pt-BR")}
              </div>
            </div>

            <div className={styles.right}>
              <div className={styles.amount}>
                R$ {expense.amount.toFixed(2)}
              </div>

              <div className={styles.actions}>

                <button
                  className={styles.editBtn}
                  onClick={() => {
                    setEditingExpense(expense);
                    setTitle(expense.title);
                    setAmount(expense.amount.toString());
                    setDate(
                      expense.expenseDate.slice(0,10)
                    );
                  }}
                >
                  <Pencil size={18}/>
                </button>

                <button
                  className={styles.deleteBtn}
                  onClick={async () => {

                    if (!confirm("Excluir gasto?")) return;

                    await deleteExpense(
                      budget.id,
                      expense.id
                    );

                    loadBudget();
                    loadExpenses();
                  }}
                >
                  <Trash2 size={18}/>
                </button>

              </div>
            </div>

          </div>

        ))}
      </div>

      {/* EDIT MODAL */}

      {editingExpense && (

        <div className={styles.modalOverlay}>
          <div className={styles.modal}>

            <h2>Editar Gasto</h2>

            <input
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
            />

            <input
              type="number"
              value={amount}
              onChange={(e)=>setAmount(e.target.value)}
            />

            <input
              type="date"
              value={date}
              onChange={(e)=>setDate(e.target.value)}
            />

            <div className={styles.modalActions}>

              <button
                className={styles.cancel}
                onClick={()=>setEditingExpense(null)}
              >
                Cancelar
              </button>

              <button
                className={styles.save}
                onClick={async ()=>{

                  await updateExpense(
                    budget.id,
                    editingExpense.id,
                    {
                      title,
                      amount:Number(amount),
                      expenseDate: date
                    }
                  );

                  setEditingExpense(null);
                  loadBudget();
                  loadExpenses();
                }}
              >
                Salvar
              </button>

            </div>

          </div>
        </div>

      )}

    </div>
  );
}