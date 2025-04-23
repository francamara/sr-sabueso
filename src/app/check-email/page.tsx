"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const RESEND_COOLDOWN_MINUTES = 3;
const STORAGE_KEY = "last_verification_email_sent";

export default function CheckEmailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState<"success" | "error" | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);

  // Redirect if already verified and admin
  useEffect(() => {
    if (session?.user?.emailVerified && session.user.role === "admin") {
      router.replace("/dashboard");
    }
  }, [session, router]);

  // On first load: only send if not verified
  useEffect(() => {
    if (
      session?.user?.email &&
      !session.user.emailVerified &&
      canResend &&
      status === "authenticated"
    ) {
      handleInitialEmailSend();
    }
  }, [session, canResend, status]);

  // Check resend cooldown
  useEffect(() => {
    const lastSent = localStorage.getItem(STORAGE_KEY);
    if (lastSent) {
      const diff = Date.now() - parseInt(lastSent);
      const cooldown = RESEND_COOLDOWN_MINUTES * 60 * 1000;

      if (diff < cooldown) {
        setCanResend(false);
        const timeLeft = Math.ceil((cooldown - diff) / 1000);
        setRemainingTime(timeLeft);

        const interval = setInterval(() => {
          const secondsLeft = Math.ceil(
            (cooldown - (Date.now() - parseInt(lastSent))) / 1000
          );
          if (secondsLeft <= 0) {
            clearInterval(interval);
            setCanResend(true);
            setRemainingTime(0);
          } else {
            setRemainingTime(secondsLeft);
          }
        }, 1000);
      }
    }
  }, []);

  const handleInitialEmailSend = async () => {
    await sendVerificationEmail();
  };

  const sendVerificationEmail = async () => {
    if (!session?.user?.email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/request-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (res.ok) {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
        setResent("success");
        setCanResend(false);
        setRemainingTime(RESEND_COOLDOWN_MINUTES * 60);

        const interval = setInterval(() => {
          setRemainingTime((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setCanResend(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setResent("error");
      }
    } catch (error) {
      console.error("Error al reenviar el email:", error);
      setResent("error");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-soft_brown-100 text-dark_moss_green-400 px-6 text-center">
      <Image src="/Isotipo.png" alt="Señor Sabueso" width={100} height={100} className="mb-6" />

      <h1 className="text-4xl font-bold mb-4">¡Revisá tu email!</h1>
      <p className="max-w-md text-lg mb-8">
        Te enviamos un correo para verificar tu cuenta. Hacé clic en el enlace para activar tu
        usuario y comenzar a pedirle alimento a tu mascota 🐶
      </p>

      {resent === "success" && (
        <p className="text-green-600 mb-4 font-semibold">Email reenviado con éxito 📬</p>
      )}
      {resent === "error" && (
        <p className="text-red-600 mb-4 font-semibold">Hubo un error al reenviar el email 😢</p>
      )}
      {!canResend && remainingTime > 0 && (
        <p className="text-sm text-gray-600 mb-4">
          Podés reenviar el email en {formatTime(remainingTime)}
        </p>
      )}

      <div className="flex flex-col gap-4 items-center">
        <button
          onClick={sendVerificationEmail}
          disabled={loading || !canResend}
          className={`px-6 py-3 bg-white text-dark_moss_green-400 font-semibold rounded-lg shadow transition hover:bg-gray-100 ${
            loading || !canResend ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Reenviando..." : "Reenviar email"}
        </button>
        {/* Botón para volver al inicio */}
        <Link href="/">
          <button className="px-6 py-3 bg-dark_moss_green-400 text-white font-semibold rounded-lg shadow hover:opacity-90 transition">
            Volver al inicio
          </button>
        </Link>

        {/* Botón solo visible en mobile */}
        <a
          href="mailto:"
          className="md:hidden inline-block px-6 py-3 bg-white text-dark_moss_green-400 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
        >
          Abrir app de Email
        </a>
      </div>
    </div>
  );
}
