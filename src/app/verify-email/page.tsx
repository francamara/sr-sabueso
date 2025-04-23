"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { Bungee } from "next/font/google";
import Button from "@/components/button";

const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bungee",
});

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Cargando...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token is required");
      return;
    }

    fetch(`/api/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.error || "Error verifying email");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setStatus("error");
        setMessage("Internal server error");
      });
  }, [token]);

  const handleGoToLogin = () => router.push("/login");

  // Estado: cargando
  if (status === "loading") {
    return <div className="text-center mt-10">Verificando tu correo…</div>;
  }

  // Estado: error
  if (status === "error") {
    return (
      <div
        className="min-h-screen flex flex-col justify-center items-center px-6"
        style={{
          backgroundColor: "#fefaf4",
          backgroundImage: "url('/patterns/bones.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "200px",
        }}
      >
        <div className="bg-old_lace-600 rounded-lg shadow-md p-8 w-full max-w-md text-center text-red-500">
          <h1 className={`text-3xl font-bold mb-4 ${bungee.className}`}>¡Uy!</h1>
          <p className="text-lg mb-8">{message}</p>
          <Button onClick={handleGoToLogin} className="w-full">
            Ir al Login
          </Button>
        </div>
      </div>
    );
  }

  // Estado: éxito
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-6"
      style={{
        backgroundColor: "#fefaf4",
        backgroundImage: "url('/patterns/bones.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "200px",
      }}
    >
      <div className="bg-old_lace-600 rounded-lg shadow-md p-8 w-full max-w-md text-center text-dark_moss_green-400">
        <Image
          src="/Isotipo.png"
          alt="Señor Sabueso"
          width={100}
          height={100}
          className="mx-auto mb-6"
        />

        <h1 className={`text-3xl font-bold mb-4 ${bungee.className}`}>
          ¡Email verificado correctamente!
        </h1>
        <p className="text-lg mb-8">
          Tu dirección de correo electrónico <strong>{email}</strong> ha sido verificada con éxito
          🐶
        </p>

        <Button onClick={handleGoToLogin} className="w-full">
          Ir al Login
        </Button>
      </div>
    </div>
  );
}
