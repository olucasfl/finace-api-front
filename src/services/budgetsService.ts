import api from "./api";

export type Budget = {
  id: string;
  name: string;
  limit: number;
  totalSpent: number;
  remaining: number;
};

export async function getBudgets(): Promise<Budget[]> {
  const response = await api.get("/budgets");
  return response.data;
}

export async function createBudget(data: {
  name: string;
  limit: number;
}): Promise<Budget> {
  const response = await api.post("/budgets", data);
  return response.data;
}

export async function updateBudget(
  id: string,
  data: { name: string; limit: number }
): Promise<Budget> {
  const response = await api.put(`/budgets/${id}`, data);
  return response.data;
}

export async function deleteBudget(id: string): Promise<void> {
  await api.delete(`/budgets/${id}`);
}