"use client";
import type { ReactNode } from "react";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Package, QrCode, ShoppingCart, ChevronDown, ChevronUp } from "lucide-react";
import UserMenu from "./userMenu";

/* ---------- Config ---------- */
const NAV = [
  { id: "home", label: "Inicio", icon: Home, href: "/dashboard" },
  {
    id: "products",
    label: "Productos",
    icon: Package,
    children: [
      { label: "Ver todos", href: "/dashboard/products" },
      { label: "Nuevo producto", href: "/dashboard/products/new" },
      { label: "Control de stock", href: "/dashboard/stock" },
    ],
  },
  {
    id: "orders",
    label: "Pedidos",
    icon: ShoppingCart,
    href: "/dashboard/orders",
    children: [
      { label: "Ver todos", href: "/dashboard/orders" },
      { label: "Nuevo Pedido", href: "/dashboard/orders/new" },
    ],
  },
  { id: "qr", label: "Generador de QR", icon: QrCode, href: "/dashboard/qr-generator" },
];

/* ---------- Hooks ---------- */
function useResponsive() {
  const [isMobile, setMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setMobile(mobile);
      setSidebarOpen(!mobile); // abierto en desktop, cerrado en mobile
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((o) => !o);

  return { isMobile, sidebarOpen, toggleSidebar };
}

/* ---------- Sub-componentes ---------- */
function NavLink({
  href,
  icon: Icon,
  label,
  active,
  onClick,
}: {
  href: string;
  icon?: typeof Home;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 p-2 rounded-md hover:bg-soft_brown-500 hover:text-old_lace-500 ${
        active ? "bg-soft_brown-500 font-semibold" : ""
      }`}
      onClick={onClick}
    >
      {Icon && <Icon className="h-5 w-5" />}
      <span>{label}</span>
    </Link>
  );
}

/* ---------- Wrapper ---------- */
export default function DashboardWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isMobile, sidebarOpen, toggleSidebar } = useResponsive();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  /* page title = etiqueta del nodo activo */
  const pageName = useMemo(() => {
    for (const n of NAV) {
      if (n.href === pathname) return n.label;
      if (n.children?.some((c) => c.href === pathname)) return n.label;
    }
    return "Página desconocida";
  }, [pathname]);

  const toggleMenu = (id: string) => setOpen((o) => ({ ...o, [id]: !o[id] }));

  /* ---------- Render ---------- */
  return (
    <div className="antialiased flex h-screen bg-soft_brown font-sans">
      {/* overlay en mobile */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20" onClick={toggleSidebar} />
      )}

      {/* ---------- Sidebar ---------- */}
      <aside
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed md:absolute z-30 w-64 bg-soft_brown-400 font-bungee text-white flex flex-col p-4 shadow-lg h-full
          transition-transform duration-300`}
      >
        {/* logo + close */}
        <div className="flex justify-between items-center">
          <Image src="/Isotipo.png" alt="Señor Sabueso" width={120} height={38} priority />
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="text-dark_moss_green-400"
              aria-label="Cerrar menú lateral"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>
        <h2 className="font-bold my-4 text-dark_moss_green-400 text-center text-2xl md:text-4xl">
          Señor Sabueso
        </h2>

        {/* nav */}
        <nav className="mt-6">
          <ul className="space-y-4">
            {NAV.map((item) =>
              item.children ? (
                <li key={item.id}>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`flex justify-between items-center w-full p-2 rounded-md hover:bg-soft_brown-500 hover:text-old_lace-500 ${
                      pathname.startsWith("/dashboard/products") || pathname === "/dashboard/stock"
                        ? "bg-soft_brown-500 font-semibold"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                    {open[item.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {open[item.id] && (
                    <ul className="ml-6 mt-2 space-y-2 text-sm">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <NavLink
                            {...c}
                            icon={undefined}
                            active={pathname === c.href}
                            onClick={isMobile ? toggleSidebar : undefined}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={item.id}>
                  <NavLink
                    {...item}
                    active={pathname === item.href}
                    onClick={isMobile ? toggleSidebar : undefined}
                  />
                </li>
              )
            )}
          </ul>
        </nav>
      </aside>

      {/* ---------- Main ---------- */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen && !isMobile ? "ml-64" : ""}`}
      >
        <header className="bg-office_green-500 text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <button onClick={toggleSidebar} className="text-white" aria-label="Toggle Sidebar">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-dark_moss_green-500">{pageName}</h1>
          </div>
          <UserMenu />
        </header>

        <main className="flex-1 p-4 md:p-6 bg-old_lace-600 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
