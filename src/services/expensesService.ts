import api from "./api";

export type Expense = {
  id: string;
  title: string;
  amount: number;
  expenseDate: string;
  createdAt: string;
};

export async function getExpenses(
  budgetId: string
): Promise<Expense[]> {

  const response = await api.get(
    `/budgets/${budgetId}/expenses`
  );

  return response.data;
}

export async function createExpense(
  budgetId: string,
  data: {
    title: string;
    amount: number;
    expenseDate?: string;
  }
): Promise<Expense> {

  const response = await api.post(
    `/budgets/${budgetId}/expenses`,
    data
  );

  return response.data;
}

export async function updateExpense(
  budgetId: string,
  expenseId: string,
  data: {
    title: string;
    amount: number;
    expenseDate?: string;
  }
): Promise<Expense> {

  const response = await api.put(
    `/budgets/${budgetId}/expenses/${expenseId}`,
    data
  );

  return response.data;
}

export async function deleteExpense(
  budgetId: string,
  expenseId: string
): Promise<void> {

  await api.delete(
    `/budgets/${budgetId}/expenses/${expenseId}`
  );

}