'use client';

import React, { useState } from "react";
import { Bungee } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/button";

const bungee = Bungee({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bungee',
});

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, username, password }),
      headers: { "Content-Type": "application/json" },
    });

    setLoading(false);

    if (res.ok) {
      router.push("/check-email");
    } else {
      const data = await res.json();
      setError(data.error || 'Ocurrió un error al registrarse');
    }
  };

  return (
    <div className={`min-h-screen bg-soft_brown flex flex-col justify-center items-center ${bungee.className}`}>
      <div className="bg-old_lace-600 p-10 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image src="/Isotipo.png" alt="Señor Sabueso" width={120} height={38} priority />
        </div>
        <h1 className="text-3xl text-center text-dark_moss_green-400 mb-6">Crear Cuenta</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-dark_moss_green-400 mb-1">Usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-dark_moss_green-400 rounded focus:outline-none focus:ring-2 focus:ring-office_green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-dark_moss_green-400 mb-1">Email</label>
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
            <label htmlFor="password" className="block text-dark_moss_green-400 mb-1">Contraseña</label>
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
          <Button
            type="submit"
            loading={loading}
            className="w-full"

          >
          Registrarse
        </Button>
        </form>
      </div>
    </div>
  );
}
