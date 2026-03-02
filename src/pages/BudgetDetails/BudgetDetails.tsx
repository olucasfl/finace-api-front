import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./BudgetDetails.module.css";
import api from "../../services/api";
import CreateExpenseForm from "../../components/CreateExpenseForm/CreateExpenseForm";
import {
  getExpenses,
  deleteExpense,
  updateExpense,
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
  const [editingExpense, setEditingExpense] =
    useState<Expense | null>(null);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

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

      {/* BOTÃO VOLTAR */}
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

      {/* CREATE */}
      <div className={styles.section}>
        <h2>Adicionar gasto</h2>

        <CreateExpenseForm
          budgetId={budget.id}
          onCreated={() => {
            loadBudget();
            loadExpenses();
          }}
        />
      </div>

      {/* LISTA */}
      <div className={styles.section}>
        <h2>Gastos</h2>

        <div className={styles.expenseList}>
          {expenses.map((expense) => (
            <div key={expense.id} className={styles.expenseItem}>
              <div className={styles.expenseInfo}>
                <div className={styles.expenseTitle}>
                  {expense.title}
                </div>
                <div className={styles.expenseDate}>
                  {new Date(
                    expense.createdAt
                  ).toLocaleDateString()}
                </div>
              </div>

              <div className={styles.right}>
                <div className={styles.amount}>
                  R$ {expense.amount.toFixed(2)}
                </div>

                <div
                  className={styles.actions}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className={styles.editBtn}
                    onClick={() => {
                      setEditingExpense(expense);
                      setTitle(expense.title);
                      setAmount(expense.amount.toString());
                    }}
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    className={styles.deleteBtn}
                    onClick={async () => {
                      if (
                        !confirm(
                          "Tem certeza que deseja excluir?"
                        )
                      )
                        return;

                      await deleteExpense(budget.id, expense.id);
                      loadBudget();
                      loadExpenses();
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL EDIT */}
      {editingExpense && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Editar Gasto</h2>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Título"
            />

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              placeholder="Valor"
            />

            <div className={styles.modalActions}>
              <button
                className={styles.cancel}
                onClick={() =>
                  setEditingExpense(null)
                }
              >
                Cancelar
              </button>

              <button
                className={styles.save}
                onClick={async () => {
                  await updateExpense(
                    budget.id,
                    editingExpense.id,
                    {
                      title,
                      amount: Number(amount),
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