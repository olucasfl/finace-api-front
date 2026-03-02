import api from "./api";

export async function login(
  email: string,
  password: string
) {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  localStorage.setItem(
    "access_token",
    response.data.access_token
  );

  localStorage.setItem(
    "refresh_token",
    response.data.refresh_token
  );

  return response.data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/";
}