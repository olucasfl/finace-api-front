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

  /* CREATE STATES */

  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPaymentMethod, setNewPaymentMethod] = useState("");

  /* EDIT STATES */

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPaymentMethod, setEditPaymentMethod] = useState("");

  const categoryLabels: Record<string, string> = {
    FOOD: "Alimentação",
    TRANSPORT: "Transporte",
    ENTERTAINMENT: "Lazer",
    HEALTH: "Saúde",
    BILLS: "Contas",
    EDUCATION: "Educação",
    TRAVEL: "Viagem",
    RENT: "Aluguel",
    SHOPPING: "Compras",
    INVESTMENTS: "Investimentos",
    SUBSCRIPTIONS: "Assinaturas",
    OTHER: "Outro"
  };

  const paymentMethodLabels: Record<string, string> = {
    PIX: "Pix",
    CREDIT_CARD: "Crédito",
    DEBIT_CARD: "Débito",
    CASH: "Dinheiro",
    BANK_TRANSFER: "Transferência",
    OTHER: "Outro"
  };

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

  /* CREATE EXPENSE */

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!newTitle || !newAmount || !newCategory || !newPaymentMethod) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    await createExpense(id!, {
      title: newTitle,
      amount: Number(newAmount),
      category: newCategory,
      paymentMethod: newPaymentMethod,
      expenseDate: newDate || undefined
    });

    setNewTitle("");
    setNewAmount("");
    setNewDate("");
    setNewCategory("");
    setNewPaymentMethod("");

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

        <form className={styles.form} onSubmit={handleCreate}>

          <input
            placeholder="Título"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Valor"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            required
          />

          <div className={styles.inputWrapper}>
            <label>Data (opcional)</label>

            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>

          <div className={styles.selectGroup}>
            <label>Categoria</label>

            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
            >
              <option value="">Selecione</option>
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
          </div>

          <div className={styles.selectGroup}>
            <label>Método de pagamento</label>

            <select
              value={newPaymentMethod}
              onChange={(e) => setNewPaymentMethod(e.target.value)}
              required
            >
              <option value="">Selecione</option>
              <option value="PIX">Pix</option>
              <option value="CREDIT_CARD">Crédito</option>
              <option value="DEBIT_CARD">Débito</option>
              <option value="CASH">Dinheiro</option>
              <option value="BANK_TRANSFER">Transferência</option>
              <option value="OTHER">Outro</option>
            </select>
          </div>

          <button type="submit">
            Adicionar
          </button>

        </form>
      </div>

      {/* EXPENSE LIST */}

      <div className={styles.expenseList}>
        {expenses.map((expense) => (

          <div key={expense.id} className={styles.expenseItem}>

            <div>

              <div className={styles.expenseTitle}>
                {expense.title}
              </div>

              <div className={styles.expenseDate}>
                {new Date(
                  expense.expenseDate || expense.createdAt
                ).toLocaleDateString("pt-BR")}
              </div>

              <div className={styles.expenseMeta}>
                {categoryLabels[expense.category]} • {paymentMethodLabels[expense.paymentMethod]}
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

                    setEditTitle(expense.title);
                    setEditAmount(expense.amount.toString());
                    setEditDate(
                      expense.expenseDate
                        ? expense.expenseDate.split("T")[0]
                        : ""
                    );
                    setEditCategory(expense.category);
                    setEditPaymentMethod(expense.paymentMethod);

                  }}
                >
                  <Pencil size={18}/>
                </button>

                <button
                  className={styles.deleteBtn}
                  onClick={async () => {

                    if (!confirm("Excluir gasto?")) return;

                    await deleteExpense(budget.id, expense.id);

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
              value={editTitle}
              onChange={(e)=>setEditTitle(e.target.value)}
            />

            <input
              type="number"
              value={editAmount}
              onChange={(e)=>setEditAmount(e.target.value)}
            />

            <input
              type="date"
              value={editDate}
              onChange={(e)=>setEditDate(e.target.value)}
            />

            <select
              value={editCategory}
              onChange={(e)=>setEditCategory(e.target.value)}
            >
              <option value="">Categoria</option>
              <option value="FOOD">Alimentação</option>
              <option value="TRANSPORT">Transporte</option>
              <option value="ENTERTAINMENT">Entretenimento</option>
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
              value={editPaymentMethod}
              onChange={(e)=>setEditPaymentMethod(e.target.value)}
            >
              <option value="">Método de pagamento</option>
              <option value="PIX">Pix</option>
              <option value="CREDIT_CARD">Crédito</option>
              <option value="DEBIT_CARD">Débito</option>
              <option value="CASH">Dinheiro</option>
              <option value="BANK_TRANSFER">Transferência</option>
              <option value="OTHER">Outro</option>
            </select>

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
                      title: editTitle,
                      amount: Number(editAmount),
                      category: editCategory,
                      paymentMethod: editPaymentMethod,
                      expenseDate: editDate
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