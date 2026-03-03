import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import {
  getBudgets,
  deleteBudget,
  updateBudget,
  createBudget,
} from "../../services/budgetsService";
import type { Budget } from "../../services/budgetsService";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";

export default function Dashboard() {
  const navigate = useNavigate();

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingBudget, setEditingBudget] =
    useState<Budget | null>(null);
  const [creating, setCreating] = useState(false);

  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");

  async function loadBudgets() {
    const data = await getBudgets();
    setBudgets(data);
  }

  useEffect(() => {
    loadBudgets();
  }, []);

  async function handleCreate() {
    await createBudget({
      name,
      limit: Number(limit),
    });

    setName("");
    setLimit("");
    setCreating(false);
    loadBudgets();
  }

  async function handleUpdate() {
    if (!editingBudget) return;

    await updateBudget(editingBudget.id, {
      name,
      limit: Number(limit),
    });

    setEditingBudget(null);
    loadBudgets();
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir?"))
      return;

    await deleteBudget(id);
    loadBudgets();
  }

  function handleLogout() {
    navigate("/login");
  }

  return (
    <div className={styles.container}>
      {/* BOTÕES SUPERIORES */}
      <div className={styles.topButtons}>
        <ThemeToggle />
        <button
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <h1 className={styles.title}>Smart Finance</h1>

      <button
        className={styles.createButton}
        onClick={() => setCreating(true)}
      >
        <PlusCircle size={20} />
        Criar Budget
      </button>

      <div className={styles.grid}>
        {budgets.map((budget) => (
          <div
            key={budget.id}
            className={styles.card}
            onClick={() =>
              navigate(`/budgets/${budget.id}`)
            }
          >
            <div className={styles.cardTop}>
              <h2>{budget.name}</h2>

              <div
                className={styles.actions}
                onClick={(e) =>
                  e.stopPropagation()
                }
              >
                <button
                  className={styles.editBtn}
                  onClick={() => {
                    setEditingBudget(budget);
                    setName(budget.name);
                    setLimit(
                      budget.limit.toString()
                    );
                  }}
                >
                  <Pencil size={18} />
                </button>

                <button
                  className={styles.deleteBtn}
                  onClick={() =>
                    handleDelete(budget.id)
                  }
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className={styles.amount}>
              R$ {budget.remaining.toFixed(2)}
            </div>

            <div className={styles.meta}>
              Limite: R$ {budget.limit.toFixed(2)}
            </div>

            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{
                  width: `${
                    (budget.totalSpent /
                      budget.limit) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
              {/* MODAL CRIAR */}
      {creating && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Novo Budget</h2>

            <input
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Limite"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />

            <div className={styles.modalActions}>
              <button
                className={styles.cancel}
                onClick={() => setCreating(false)}
              >
                Cancelar
              </button>

              <button
                className={styles.save}
                onClick={handleCreate}
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

            {editingBudget && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Editar Budget</h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />

            <div className={styles.modalActions}>
              <button
                className={styles.cancel}
                onClick={() => setEditingBudget(null)}
              >
                Cancelar
              </button>

              <button
                className={styles.save}
                onClick={handleUpdate}
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