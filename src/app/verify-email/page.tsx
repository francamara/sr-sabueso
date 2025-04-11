// app/verify-email/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  return (
    <div>
      <h1>Verificando tu correo electrónico</h1>
      <p>Token: {token}</p>
      <p>Email: {email}</p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
