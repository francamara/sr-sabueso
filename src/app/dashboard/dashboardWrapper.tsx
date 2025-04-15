"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ChevronUp, Home, Package, QrCode, ShoppingCart } from "lucide-react";
import UserMenu from "./userMenu";

function getPageName(pathname: string): string {
  const paths: { [key: string]: string } = {
    "/dashboard": "Inicio",
    "/dashboard/stock": "Control de stock",
    "/dashboard/qr-generator": "Generador de QR",
    "/dashboard/orders": "Pedidos",
    "/dashboard/products": "Productos",
    "/dashboard/products/new": "Crear Nuevo Producto",
  };

  return paths[pathname] || "Página desconocida";
}

export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageName = getPageName(pathname);

  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    products: false,
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActive = (path: string) => pathname === path;
  const isProductsSection =
    pathname.startsWith("/dashboard/products") || pathname === "/dashboard/stock";

  return (
    <div className="antialiased flex h-screen bg-soft_brown font-sans">
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={toggleSidebar} />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:absolute z-30 w-64 bg-soft_brown-400 font-bungee text-white flex flex-col p-4 shadow-lg h-full transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center">
          <Image
            src="/Isotipo.png"
            alt="Señor Sabueso"
            width={120}
            height={38}
            priority
            className="mx-auto"
          />
          {isMobile && (
            <button onClick={toggleSidebar} className="text-dark_moss_green-400">
              <X className="h-6 w-6" />a
            </button>
          )}
        </div>
        <h2 className="font-bold my-4 text-dark_moss_green-400 text-center text-2xl md:text-4xl">
          Señor Sabueso
        </h2>

        <nav className="mt-6">
          <ul className="space-y-4">
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 p-2 rounded-md hover:bg-soft_brown-500 hover:text-old_lace-500 ${
                  isActive("/dashboard") ? "bg-soft_brown-500 font-semibold" : ""
                }`}
                onClick={() => isMobile && toggleSidebar()}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
            </li>

            {/* Productos con submenú */}
            <li>
              <button
                onClick={() => toggleMenu("products")}
                className={`flex justify-between items-center w-full p-2 rounded-md hover:bg-soft_brown-500 hover:text-old_lace-500 ${
                  isProductsSection ? "bg-soft_brown-500 font-semibold" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  <span>Productos</span>
                </div>
                <span>
                  {openMenus.products ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </span>
              </button>
              {openMenus.products && (
                <ul className="ml-6 mt-2 space-y-2 text-sm">
                  <li>
                    <Link
                      href="/dashboard/products"
                      className={`block p-2 rounded-md hover:bg-soft_brown-500 hover:text-old_lace-500 ${
                        isActive("/dashboard/products") ? "bg-soft_brown-500 font-semibold" : ""
                      }`}
                      onClick={() => isMobile && toggleSidebar()}
                    >
                      Ver todos
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/products/new"
                      className={`block p-2 rounded-md hover:bg-soft_brown-500 hover:text-old_lace-500 ${
                        isActive("/dashboard/products/new") ? "bg-soft_brown-500 font-semibold" : ""
                      }`}
                      onClick={() => isMobile && toggleSidebar()}
                    >
                      Nuevo producto
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/stock"
                      className={`block p-2 rounded-md hover:bg-soft_brown-500 hover:text-old_lace-500 ${
                        isActive("/dashboard/stock") ? "bg-soft_brown-500 font-semibold" : ""
                      }`}
                      onClick={() => isMobile && toggleSidebar()}
                    >
                      Control de stock
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link
                href="/dashboard/qr-generator"
                className={`flex items-center gap-2 p-2 rounded-md hover:bg-soft_brown-500 hover:text-old_lace-500 ${
                  isActive("/dashboard/qr-generator") ? "bg-soft_brown-500 font-semibold" : ""
                }`}
                onClick={() => isMobile && toggleSidebar()}
              >
                <QrCode className="h-5 w-5" />
                <span>Generador de QR</span>
              </Link>
            </li>

            <li>
              <Link
                href="/dashboard/orders"
                className={`flex items-center gap-2 p-2 rounded-md hover:bg-soft_brown-500 hover:text-old_lace-500 ${
                  isActive("/dashboard/orders") ? "bg-soft_brown-500 font-semibold" : ""
                }`}
                onClick={() => isMobile && toggleSidebar()}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Pedidos</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen && !isMobile ? "ml-64" : "ml-0"}`}
      >
        <header className="bg-office_green-500 text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              className="text-white focus:outline-none"
              aria-label="Toggle Sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-dark_moss_green-500">{pageName}</h1>
          </div>
          <nav>
            <UserMenu />
          </nav>
        </header>

        <main className="flex-1 p-4 md:p-6 bg-old_lace-600 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
