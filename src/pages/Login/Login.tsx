import { useState } from "react";
import styles from "./Login.module.css";
import { loginRequest } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginRequest(email, password);
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } catch {
      alert("Credenciais inválidas");
    }

    setLoading(false);
  }

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.card} glass`}>
        <h1 className={styles.title}>Finance</h1>

        <form onSubmit={handleLogin} className={styles.form}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}