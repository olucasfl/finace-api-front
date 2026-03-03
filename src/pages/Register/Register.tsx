import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import api from "../../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/users", {
        name,
        email,
        password,
        confirmPassword,
      });

      alert("Conta criada com sucesso!");
      navigate("/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao registrar");
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
          className={styles.registerLogo}
        />

        <h1 className={styles.logo}>Smart Finance</h1>

        <p className={styles.subtitle}>
          Crie sua conta
        </p>

        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder=" "
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label>Nome</label>
          </div>

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

          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder=" "
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
            />
            <label>Confirmar senha</label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <div className={styles.switch}>
          Já possui uma conta?{" "}
          <span onClick={() => navigate("/login")}>
            Clique aqui
          </span>
        </div>
      </div>
    </div>
  );
}