import { useState, useEffect } from "react";
import { login } from "../../services/authService";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Login.module.css";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import api from "../../services/api";

export default function Login() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetToken, setResetToken] = useState("");

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

  // detectar token de reset na URL
  useEffect(() => {

    const token = searchParams.get("resetToken");

    if (token) {
      setResetToken(token);
      setResetOpen(true);
    }

  }, []);

  async function handleLogin(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);
    setEmailNotVerified(false);
    setResendSuccess(false);

    try {

      await login(email, password);

      navigate("/dashboard");

    } catch (err: any) {

      const message = err.response?.data?.message;

      if (message === "Please verify your email before logging in") {

        setEmailNotVerified(true);

      } else {

        alert("Credenciais inválidas");

      }

    } finally {

      setLoading(false);

    }

  }

  async function resendEmail() {

    setResendLoading(true);

    try {

      await api.post("/auth/resend-verification", { email });

      setResendSuccess(true);

    } catch {

      alert("Erro ao reenviar email");

    } finally {

      setResendLoading(false);

    }

  }

  async function sendResetEmail() {

    try {

      await api.post("/auth/forgot-password", {
        email: resetEmail
      });

      alert("Email de recuperação enviado!");

      setForgotOpen(false);

    } catch {

      alert("Erro ao enviar email");

    }

  }

  async function resetPassword() {

    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }

    try {

      await api.post("/auth/reset-password", {
        token: resetToken,
        password: newPassword
      });

      alert("Senha alterada com sucesso!");

      setResetOpen(false);

    } catch {

      alert("Erro ao redefinir senha");

    }

  }

  return (
    <div className={styles.wrapper}>

      <div className={styles.topButtons}>
        <ThemeToggle />
      </div>

      <div className={styles.card}>

        <img
          src={
            theme === "dark"
              ? "/logo-SF-gold-512.png"
              : "/logo-SF-blue-512.png"
          }
          alt="Smart Finance"
          className={styles.loginLogo}
        />

        <h1 className={styles.logo}>
          Smart Finance
        </h1>

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

        <div
          style={{ marginTop: "10px", cursor: "pointer", fontSize: "14px" }}
          onClick={() => setForgotOpen(true)}
        >
          Esqueci minha senha
        </div>

        {emailNotVerified && (

          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              borderRadius: "10px",
              background: "rgba(255, 193, 7, 0.15)",
              border: "1px solid rgba(255,193,7,0.4)",
              textAlign: "center"
            }}
          >

            <p style={{ marginBottom: "10px", fontWeight: 500 }}>
              Seu email ainda não foi verificado.
            </p>

            {!resendSuccess && (
              <button
                onClick={resendEmail}
                disabled={resendLoading}
              >
                {resendLoading ? "Enviando..." : "Reenviar email de verificação"}
              </button>
            )}

            {resendSuccess && (
              <p style={{ color: "#22c55e", fontWeight: 500 }}>
                Email reenviado!
              </p>
            )}

          </div>

        )}

        <div className={styles.switch}>
          Ainda não possui uma conta?{" "}
          <span onClick={() => navigate("/register")}>
            Clique aqui
          </span>
        </div>

      </div>

      {/* MODAL ESQUECI SENHA */}

      {forgotOpen && (

        <div className={styles.modalOverlay}>

          <div className={styles.modal}>

            <h2>Recuperar senha</h2>

            <input
              type="email"
              placeholder="Digite seu email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />

            <button onClick={sendResetEmail}>
              Enviar email de recuperação
            </button>

            <button onClick={() => setForgotOpen(false)}>
              Cancelar
            </button>

          </div>

        </div>

      )}

      {/* MODAL RESET SENHA */}

      {resetOpen && (

        <div className={styles.modalOverlay}>

          <div className={styles.modal}>

            <h2>Redefinir senha</h2>

            <input
              type="password"
              placeholder="Nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button onClick={resetPassword}>
              Atualizar senha
            </button>

          </div>

        </div>

      )}

    </div>
  );
}