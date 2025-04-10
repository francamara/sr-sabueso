'use client';

import { Bungee } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bungee",
});

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="es">
        <body className={bungee.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
        </body>
      </html>
    );
  }
  