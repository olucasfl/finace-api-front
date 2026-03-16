import api from "./api";

type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

/* ============================= */
/* LOGIN */
/* ============================= */

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {

  const response = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });

  const { access_token, refresh_token } = response.data;

  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);

  return response.data;
}

/* ============================= */
/* LOGOUT */
/* ============================= */

export function logout() {

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  window.location.href = "/login";
}

/* ============================= */
/* TOKEN HELPERS */
/* ============================= */

export function getAccessToken(): string | null {
  return localStorage.getItem("access_token");
}

export function getRefreshToken(): string | null {
  return localStorage.getItem("refresh_token");
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("access_token");
}