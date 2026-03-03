import { useState, useEffect } from "react";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "light";
      setTheme(currentTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      alert("Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.topButtons}>
        <ThemeToggle />
      </div>

      <div className={styles.card}>
        {/* LOGO DINÂMICA */}
        <img
          src={
            theme === "dark"
              ? "/logo-SF-gold-512.png"
              : "/logo-SF-blue-512.png"
          }
          alt="Smart Finance"
          className={styles.loginLogo}
        />

        <h1 className={styles.logo}>Smart Finance</h1>

        <p className={styles.subtitle}>
          Controle inteligente das suas finanças
        </p>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email</label>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Senha</label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className={styles.switch}>
          Ainda não possui uma conta?{" "}
          <span onClick={() => navigate("/register")}>
            Clique aqui
          </span>
        </div>
      </div>
    </div>
  );
}