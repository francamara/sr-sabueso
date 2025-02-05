"use client";

import { Bungee } from "next/font/google";
import "../globals.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";


const bungee = Bungee({
  subsets: ["latin"],
  weight: "400", // Regular weight
});

// Función para convertir rutas a nombres más amigables
function getPageName(pathname: string): string {
  const paths: { [key: string]: string } = {
    "/": "Inicio",
    "/stock": "Control de stock",
    "/qr-generator": "Generador de QR",
    "/pedidos": "Pedidos",
    "/products": "Productos",
  };

  return paths[pathname] || "Página desconocida";
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const pageName = getPageName(pathname);

  return (
    <html lang="es">
      <body
        className={`${bungee.className} antialiased flex h-screen bg-soft_brown`}
      >
        {/* Sidebar */}
        <aside className="w-64 bg-soft_brown-400 text-white flex flex-col p-4 shadow-lg">
          <Image src="/Isotipo.png" alt="Señor Sabueso" width={180} height={38} priority className="mx-auto"/>
          <h2 className="font-bold mb-6 text-dark_moss_green-400 text-center text-4xl">Señor Sabueso</h2>
          <nav>
            <ul className="space-y-4">
              <li>
                <Link href="/dashboard" className="hover:text-old_lace-500">Home</Link>
              </li>
              <li>
                <Link href="/dashboard/products" className="hover:text-old_lace-500">Productos</Link>
              </li>
              <li>
                <Link href="/dashboard/qr-generator" className="hover:text-old_lace-500">Generador de QR</Link>
              </li>
              <li>
                <Link href="/dashboard/pedidos" className="hover:text-old_lace-500">Pedidos</Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-office_green-500 text-white p-4 flex items-center justify-between shadow-md">
            <h1 className="text-xl font-semibold text-dark_moss_green-500">{pageName}</h1>
            <nav>
              <Link href="/dashboard" className="hover:underline text-soft_brown-500">Mi Perfil</Link>
            </nav>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 bg-old_lace-600 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
