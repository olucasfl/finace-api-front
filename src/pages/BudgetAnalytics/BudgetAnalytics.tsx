import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./BudgetAnalytics.module.css";
import api from "../../services/api";
import { getExpenses } from "../../services/expensesService";
import type { Expense } from "../../services/expensesService";

import ProgressChart from "../../components/analytics/ProgressChart";
import DailyExpensesChart from "../../components/analytics/DailyExpenseChart";
import DistributionChart from "../../components/analytics/DistribuitionChart";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";

type Budget = {
  id: string;
  name: string;
  limit: number;
  totalSpent: number;
  remaining: number;
};

export default function BudgetAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [budget, setBudget] = useState<Budget | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    async function load() {
      const budgetRes = await api.get(`/budgets/${id}`);
      setBudget(budgetRes.data);

      const expensesRes = await getExpenses(id!);
      setExpenses(expensesRes);
    }

    load();
  }, [id]);

  // 🔥 Evolução acumulada
    const cumulativeData = useMemo(() => {
    if (!expenses.length) return [];

    const groupedByDay: Record<string, number> = {};

    expenses.forEach((expense) => {
        const dateObj = new Date(expense.createdAt);

        const day = dateObj.toLocaleDateString("pt-BR"); // ✅ LOCAL

        groupedByDay[day] =
        (groupedByDay[day] || 0) + expense.amount;
    });

    // Ordenar corretamente convertendo de volta para Date
    const sortedDays = Object.keys(groupedByDay).sort(
        (a, b) => {
        const [da, ma, aa] = a.split("/");
        const [db, mb, ab] = b.split("/");

        const dateA = new Date(+aa, +ma - 1, +da);
        const dateB = new Date(+ab, +mb - 1, +db);

        return dateA.getTime() - dateB.getTime();
        }
    );

    let cumulative = 0;

    return sortedDays.map((day) => {
        cumulative += groupedByDay[day];

        return {
        date: day,
        total: cumulative,
        };
    });
    }, [expenses]);

  // 🔥 Gastos por dia
  const dailyData = useMemo(() => {
    const grouped: Record<string, number> = {};

    expenses.forEach((expense) => {
      const date = new Date(
        expense.createdAt
      ).toLocaleDateString();

      grouped[date] =
        (grouped[date] || 0) + expense.amount;
    });

    return Object.entries(grouped).map(
      ([date, total]) => ({
        date,
        total,
      })
    );
  }, [expenses]);

  // 🔥 Distribuição
  const distributionData = expenses.map((e) => ({
    name: e.title,
    value: e.amount,
  }));

  if (!budget) return <div>Carregando...</div>;

  const percentage =
    (budget.totalSpent / budget.limit) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.topButtons}>
        <ThemeToggle />
      </div>

      <button
        className={styles.backButton}
        onClick={() => navigate(-1)}
      >
        ← Voltar
      </button>

      <h1 className={styles.title}>
        {budget.name} - Analytics
      </h1>

      {/* MÉTRICAS */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span>Total gasto</span>
          <h2>R$ {budget.totalSpent.toFixed(2)}</h2>
        </div>

        <div className={styles.metricCard}>
          <span>Limite</span>
          <h2>R$ {budget.limit.toFixed(2)}</h2>
        </div>

        <div className={styles.metricCard}>
          <span>% usado</span>
          <h2>{percentage.toFixed(1)}%</h2>
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className={styles.chartCard}>
        <h2 className={styles.chartTitle}>Evolução do Gasto</h2>
        <ProgressChart data={cumulativeData} />
      </div>

      <div className={styles.chartCard}>
        <h2 className={styles.chartTitle}>Gastos por Dia</h2>
        <DailyExpensesChart data={dailyData} />
      </div>

      <div className={styles.chartCard}>
        <h2 className={styles.chartTitle}>Distribuição</h2>
        <DistributionChart data={distributionData} />
      </div>
    </div>
  );
}