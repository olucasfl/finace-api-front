import api from "./api";

export async function getBudgets() {
  const response = await api.get("/budgets");
  return response.data;
}

export async function deleteBudget(id: string) {
  await api.delete(`/budgets/${id}`);
}

export async function createBudget(name: string, limit: number) {
  const response = await api.post("/budgets", {
    name,
    limit,
  });

  return response.data;
}

export async function updateBudget(
  id: string,
  name: string,
  limit: number
) {
  const response = await api.put(`/budgets/${id}`, {
    name,
    limit,
  });

  return response.data;
}