"use client";

import { Bungee } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/button";

const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bungee",
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError(res?.error || "Email o contraseña incorrectos");
    }
  };

  // Si viene callbackUrl (por ejemplo después de un signIn forzado), limpiamos la URL
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has("callbackUrl")) {
      window.history.replaceState({}, document.title, "/login");
    }
  }, []);

  return (
    <div
      className={`min-h-screen bg-soft_brown flex flex-col justify-center items-center ${bungee.className}`}
    >
      <div className="bg-old_lace-600 p-10 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image src="/Isotipo.png" alt="Señor Sabueso" width={120} height={38} priority />
        </div>
        <h1 className="text-3xl text-center text-dark_moss_green-400 mb-6">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-dark_moss_green-400 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-dark_moss_green-400 rounded focus:outline-none focus:ring-2 focus:ring-office_green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-dark_moss_green-400 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-dark_moss_green-400 rounded focus:outline-none focus:ring-2 focus:ring-office_green-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" loading={isLoading} className="w-full">
            Iniciar Sesión
          </Button>
        </form>
      </div>
    </div>
  );
}
