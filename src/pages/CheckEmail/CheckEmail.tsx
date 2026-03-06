import { useLocation } from "react-router-dom";
import api from "../../services/api";

export default function CheckEmail() {

  const location = useLocation();
  const email = location.state?.email;

  async function resendEmail() {

    try {

      await api.post("/auth/resend-verification", {
        email
      });

      alert("Email reenviado!");

    } catch {

      alert("Erro ao reenviar email");

    }

  }

  return (
    <div style={{textAlign:"center", marginTop:"80px"}}>

      <h1>Verifique seu email</h1>

      <p>
        Enviamos um link de verificação para:
        <br />
        <strong>{email}</strong>
      </p>

      <p>
        Clique no link enviado para ativar sua conta.
      </p>

      <button onClick={resendEmail}>
        Reenviar email
      </button>

    </div>
  );

}