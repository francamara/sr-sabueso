"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const [message, setMessage] = useState("Verifying your email...");
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("Verification token is missing.");
      return;
    }

    fetch(`/api/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage(`⚠️ ${data.error}`);
        } else {
          setMessage("✅ Email verificado! Ya podés iniciar sesion.");
        }
      })
      .catch(() => {
        setMessage("Ocurrio un error verificando el email. Por favor, contactate con nosotros para poder ayudarte.");
      });
  }, [searchParams]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>{message}</h1>
    </div>
  );
}
