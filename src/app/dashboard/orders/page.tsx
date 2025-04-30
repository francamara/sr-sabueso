"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { formatPrice } from "@/app/utils/utils"; // ➜ $ 1.234,00
import { format } from "date-fns"; // ➜ 17-04-2025 14:30

/* ---------- Tipos ---------- */
type User = { id: number; name: string };
type Address = { id: number; full: string };

type Order = {
  id: number;
  user: User;
  address: Address | null;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "canceled";
  total: number;
  created_at: string; // ISO
};

/* ---------- Config ---------- */
const statusColors: Record<Order["status"], string> = {
  pending: "bg-yellow-100  text-yellow-800",
  confirmed: "bg-blue-100    text-blue-800",
  shipped: "bg-purple-100  text-purple-800",
  delivered: "bg-green-100   text-green-800",
  canceled: "bg-red-100     text-red-800",
};

const TABLE_HEADERS = [
  { key: "id", label: "Pedido #" },
  { key: "user.name", label: "Cliente" },
  { key: "address", label: "Dirección" },
  { key: "status", label: "Estado" },
  { key: "total", label: "Total" },
  { key: "created_at", label: "Creado" },
] as const;

/* ---------- Componente ---------- */
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  /* filtros UI */
  const [searchId, setSearchId] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [filterState, setFilterState] = useState("");

  /* ordenamiento */
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  const [loading, setLoading] = useState(true);

  /* ---------- Carga inicial ---------- */
  useEffect(() => {
    (async () => {
      try {
        const [{ data: ordersData }, { data: attr }] = await Promise.all([
          axios.get("/api/orders"), // lista de pedidos
          axios.get("/api/orders/attributes"), // clientes, estados (si lo tienes)
        ]);
        setOrders(ordersData);
        setFilteredOrders(ordersData);
        setUsers(attr.users ?? []);
      } catch (e) {
        console.error("Error cargando pedidos", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------- Filtrado + Ordenamiento ---------- */
  useEffect(() => {
    if (!Array.isArray(orders)) return;

    let result = [...orders];

    if (searchId.trim()) {
      result = result.filter((o) => o.id.toString().includes(searchId.trim()));
    }

    if (searchUser.trim()) {
      result = result.filter((o) => o.user.name.toLowerCase().includes(searchUser.toLowerCase()));
    }

    if (filterState) {
      result = result.filter((o) => o.status === filterState);
    }

    /* ordenamiento genérico */
    if (sortField && sortOrder) {
      result.sort((a, b) => {
        const get = (obj: any, path: string) =>
          path.split(".").reduce((acc, cur) => acc?.[cur], obj);

        const av = get(a, sortField);
        const bv = get(b, sortField);

        if (av == null || bv == null) return 0;

        if (typeof av === "string" && typeof bv === "string") {
          return sortOrder === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
        }
        if (typeof av === "number" && typeof bv === "number") {
          return sortOrder === "asc" ? av - bv : bv - av;
        }
        return 0;
      });
    }

    setFilteredOrders(result);
  }, [orders, searchId, searchUser, filterState, sortField, sortOrder]);

  const handleSort = (field: string) => {
    if (sortField !== field) {
      setSortField(field);
      setSortOrder("desc");
    } else if (sortOrder === "desc") {
      setSortOrder("asc");
    } else {
      setSortField(null);
      setSortOrder(null);
    }
  };

  const arrow = (field: string) =>
    sortField === field ? (sortOrder === "asc" ? " 🔼" : " 🔽") : "";

  /* ---------- Render ---------- */
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-soft_brown-100 text-dark_moss_green-400">
        <span className="text-xl font-semibold animate-pulse">Cargando pedidos…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-20 px-6 bg-old_lace-600 text-dark_moss_green-500 font-sans">
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 w-full bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Buscar por # de pedido"
          aria-label="Buscar por número de pedido"
          className="p-3 border border-gray-300 rounded-lg shadow-sm"
        />
        <input
          type="text"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          placeholder="Buscar por cliente"
          aria-label="Buscar por nombre de cliente"
          className="p-3 border border-gray-300 rounded-lg shadow-sm"
        />
        <select
          value={filterState}
          onChange={(e) => setFilterState(e.target.value)}
          aria-label="Filtrar por estado"
          className="p-3 border border-gray-300 rounded-lg shadow-sm"
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="confirmed">Confirmado</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregado</option>
          <option value="canceled">Cancelado</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto w-full mt-8">
        {filteredOrders.length ? (
          <div className="rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <table className="min-w-full bg-white text-sm text-left text-gray-700">
              <thead className="bg-dark_moss_green-500 text-white select-none">
                <tr>
                  {TABLE_HEADERS.map(({ key, label }) => (
                    <th
                      key={key}
                      className="p-4 cursor-pointer whitespace-nowrap"
                      onClick={() => handleSort(key)}
                    >
                      {label}
                      {arrow(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    {/* #pedido */}
                    <td className="p-4 border-t font-semibold">{o.id}</td>

                    {/* cliente */}
                    <td className="p-4 border-t">{o.user.name}</td>

                    {/* dirección */}
                    <td className="p-4 border-t">{o.address?.full ?? "-"}</td>

                    {/* estado */}
                    <td className="p-4 border-t">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          statusColors[o.status]
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>

                    {/* total */}
                    <td className="p-4 border-t font-bold">{formatPrice(o.total)}</td>

                    {/* fecha */}
                    <td className="p-4 border-t whitespace-nowrap">
                      {format(new Date(o.created_at), "dd-MM-yyyy HH:mm")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No hay pedidos que coincidan con tu búsqueda.
          </p>
        )}
      </div>
    </div>
  );
}
