"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Señor Sabueso",
//   description: "Sistema inteligente de logistica de alimento balanceado para mascotas",
// };

// Función para convertir rutas a nombres más amigables
function getPageName(pathname: string): string {
  const paths: { [key: string]: string } = {
    "/": "Inicio",
    "/stock": "Control de stock",
    "/qr-generator": "Geneador de QR",
    "/pedidos": "Pedidos",
  };

  return paths[pathname] || "Página desconocida";
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // Obtener la ruta actual
  const pageName = getPageName(pathname); // Traducir ruta a un nombre de página
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen`}
      >
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
            <Image
            src="/Isotipo.png"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
            />
          <h2 className="text-lg font-bold mb-6">Señor Sabueso</h2>
          <nav>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="hover:text-gray-300">Home</Link>
              </li>
              <li>
                <Link href="/stock" className="hover:text-gray-300">Control de stock</Link>
              </li>
              <li>
                <Link href="/qr-generator" className="hover:text-gray-300">Generador de QR</Link>
              </li>
              <li>
                <Link href="/pedidos" className="hover:text-gray-300">Pedidos</Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-blue-600 text-white p-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">{pageName}</h1>
            <nav>
              <a href="/perfil" className="hover:underline">Mi Perfil</a>
            </nav>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
