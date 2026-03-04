import { useEffect, useState, useMemo } from "react";
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
import {
  Pencil,
  Trash2,
  ArrowLeft,
  SlidersHorizontal,
} from "lucide-react";
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

  // 🔥 FILTROS
  const [showFilters, setShowFilters] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  function handleClearFilters() {
  setFilterName("");
  setFilterDate("");
  setMinValue("");
  setMaxValue("");
  setPage(1);
}

  // 🔥 PAGINAÇÃO
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

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

  // 🔥 CONTADOR DE FILTROS ATIVOS
  const activeFiltersCount = [
    filterName,
    filterDate,
    minValue,
    maxValue,
  ].filter(Boolean).length;

  // 🔥 FILTRO
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesName = expense.title
        .toLowerCase()
        .includes(filterName.toLowerCase());

      const matchesDate = filterDate
        ? new Date(expense.createdAt)
            .toISOString()
            .slice(0, 10) === filterDate
        : true;

      const matchesMin = minValue
        ? expense.amount >= Number(minValue)
        : true;

      const matchesMax = maxValue
        ? expense.amount <= Number(maxValue)
        : true;

      return (
        matchesName &&
        matchesDate &&
        matchesMin &&
        matchesMax
      );
    });
  }, [expenses, filterName, filterDate, minValue, maxValue]);

  const totalPages =
    filteredExpenses.length === 0
      ? 1
      : Math.ceil(filteredExpenses.length / itemsPerPage);

  const paginatedExpenses = filteredExpenses.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // 🔥 GARANTE QUE A PAGINAÇÃO NUNCA QUEBRE
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [filteredExpenses, totalPages, page]);

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
        <div className={styles.sectionHeader}>
          <h2>Gastos</h2>

          <button
            className={`${styles.filterButton} ${
              activeFiltersCount > 0
                ? styles.filterActive
                : ""
            }`}
            onClick={() => setShowFilters(true)}
          >
            <SlidersHorizontal size={18} />
            Filtros
            {activeFiltersCount > 0 && (
              <span className={styles.filterBadge}>
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className={styles.expenseList}>
          {paginatedExpenses.map((expense) => (
            <div
              key={expense.id}
              className={styles.expenseItem}
            >
              <div className={styles.expenseInfo}>
                <div className={styles.expenseTitle}>
                  {expense.title}
                </div>
                <div className={styles.expenseDate}>
                  {new Date(
                    expense.createdAt
                  ).toLocaleString("pt-BR")}
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
                      setAmount(
                        expense.amount.toString()
                      );
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

                      await deleteExpense(
                        budget.id,
                        expense.id
                      );
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

        {/* PAGINAÇÃO */}
        <div className={styles.pagination}>
          <button
            onClick={() =>
              setPage((p) => Math.max(p - 1, 1))
            }
            disabled={page === 1}
          >
            ←
          </button>

          <span>{page}</span>

          <button
            onClick={() =>
              setPage((p) =>
                Math.min(p + 1, totalPages)
              )
            }
            disabled={page >= totalPages}
          >
            →
          </button>
        </div>
      </div>

      {/* MODAL FILTROS */}
      {showFilters && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Filtros</h2>

            <input
              placeholder="Nome"
              value={filterName}
              onChange={(e) =>
                setFilterName(e.target.value)
              }
            />

            <input
              type="date"
              value={filterDate}
              onChange={(e) =>
                setFilterDate(e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Valor mínimo"
              value={minValue}
              onChange={(e) =>
                setMinValue(e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Valor máximo"
              value={maxValue}
              onChange={(e) =>
                setMaxValue(e.target.value)
              }
            />

            <div className={styles.modalActions}>
              <button
                className={styles.clearFilters}
                onClick={handleClearFilters}
              >
                🔴 Limpar tudo
              </button>

              <button
                className={styles.cancel}
                onClick={() => setShowFilters(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {editingExpense && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Editar Gasto</h2>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
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