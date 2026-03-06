import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";

export default function VerifyEmail() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("loading");

  useEffect(() => {

    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    async function verify() {
      try {

        await api.get(`/auth/verify-email?token=${token}`);

        setStatus("success");

        setTimeout(() => {
          navigate("/login");
        }, 2500);

      } catch {

        setStatus("error");

      }
    }

    verify();

  }, []);

  if (status === "loading") {
    return <h2>Verificando seu email...</h2>;
  }

  if (status === "success") {
    return (
      <div>
        <h2>Email verificado com sucesso!</h2>
        <p>Redirecionando para login...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Link inválido ou expirado</h2>
    </div>
  );

}