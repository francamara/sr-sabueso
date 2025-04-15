"use client";

import { Bungee, Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bungee",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // variable CSS para usar en Tailwind o CSS
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${bungee.variable}`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
