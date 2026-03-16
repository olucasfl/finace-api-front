import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/*
==============================
REQUEST INTERCEPTOR
Adiciona o access_token
==============================
*/

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;

});


/*
==============================
RESPONSE INTERCEPTOR
Refresh automático
==============================
*/

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    /*
    Se não houver resposta do servidor
    */
    if (!error.response) {
      return Promise.reject(error);
    }

    /*
    Se for 401 e ainda não tentou refresh
    */
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {

      originalRequest._retry = true;

      try {

        const refreshToken = localStorage.getItem("refresh_token");

        /*
        Se não existir refresh token → logout
        */

        if (!refreshToken) {

          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");

          window.location.href = "/login";

          return Promise.reject(error);
        }

        /*
        Faz refresh do token
        */

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {
            refresh_token: refreshToken,
          }
        );

        const { access_token, refresh_token } = response.data;

        /*
        Salva novos tokens
        */

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        /*
        Atualiza header da requisição original
        */

        originalRequest.headers.Authorization =
          `Bearer ${access_token}`;

        /*
        Refaz requisição original
        */

        return api(originalRequest);

      } catch (refreshError) {

        /*
        Refresh token expirou
        */

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }

);

export default api;