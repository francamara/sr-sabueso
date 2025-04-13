'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "../components/userMenu";

function getPageName(pathname: string): string {
  const paths: { [key: string]: string } = {
    "/dashboard": "Inicio",
    "/dashboard/stock": "Control de stock",
    "/dashboard/qr-generator": "Generador de QR",
    "/dashboard/orders": "Pedidos",
    "/dashboard/products": "Productos",
    "/dashboard/products/new": "Crear Nuevo Producto"
  };

  return paths[pathname] || "Página desconocida";
}

export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageName = getPageName(pathname);

  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    products: false,
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <div className="antialiased flex h-screen bg-soft_brown">
      {/* Sidebar */}
      <aside className="w-64 bg-soft_brown-400 text-white flex flex-col p-4 shadow-lg">
        <Image src="/Isotipo.png" alt="Señor Sabueso" width={180} height={38} priority className="mx-auto" />
        <h2 className="font-bold mb-6 text-dark_moss_green-400 text-center text-4xl">Señor Sabueso</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link href="/dashboard" className="hover:text-old_lace-500">Home</Link>
            </li>

            {/* Productos con submenú */}
            <li>
              <button
                onClick={() => toggleMenu("products")}
                className="flex justify-between items-center w-full hover:text-old_lace-500"
              >
                <span>Productos</span>
                <span>{openMenus.products ? "▲" : "▼"}</span>
              </button>
              {openMenus.products && (
                <ul className="ml-4 mt-2 space-y-2 text-sm">
                  <li>
                    <Link href="/dashboard/products" className="hover:text-old_lace-500">Ver todos</Link>
                  </li>
                  <li>
                    <Link href="/dashboard/products/new" className="hover:text-old_lace-500">Nuevo producto</Link>
                  </li>
                  <li>
                    <Link href="/dashboard/stock" className="hover:text-old_lace-500">Control de stock</Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link href="/dashboard/qr-generator" className="hover:text-old_lace-500">Generador de QR</Link>
            </li>
            <li>
              <Link href="/dashboard/orders" className="hover:text-old_lace-500">Pedidos</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-office_green-500 text-white p-4 flex items-center justify-between shadow-md">
          <h1 className="text-xl font-semibold text-dark_moss_green-500">{pageName}</h1>
          <nav>
            <UserMenu />
          </nav>
        </header>

        <main className="flex-1 p-6 bg-old_lace-600 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
