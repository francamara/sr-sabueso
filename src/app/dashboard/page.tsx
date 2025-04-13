"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBoxOpen, FaChartBar, FaClipboardList } from "react-icons/fa"; // Importando iconos

export default function Home() {
  const [latestOrders, setLatestOrders] = useState<{id: number, date: string, day: string, total: string}[]>([]);

  useEffect(() => {
    // Simulamos algunos pedidos para el placeholder
    setLatestOrders([
      { id: 1, date: "2025-04-12", day: "Lunes", total: "$2500" },
      { id: 2, date: "2025-04-11", day: "Domingo", total: "$1500" },
      { id: 3, date: "2025-04-10", day: "Sábado", total: "$3200" },
    ]);
  }, []);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen px-4 sm:px-6">
      <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start w-full">
        {/* Accesos directos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 w-full">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
            <Link href="/dashboard/products/new" className="block select-none">
              <FaBoxOpen className="text-4xl text-dark_moss_green-400 mx-auto mb-4" />
              <h2 className="text-xl text-center text-dark_moss_green-400">Agregar Productos</h2>
              <p className="text-center text-gray-600">Agregar y editar los productos del listado</p>
            </Link>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
            <Link href="/dashboard/products" className="block select-none">
              <FaChartBar className="text-4xl text-dark_moss_green-400 mx-auto mb-4" />
              <h2 className="text-xl text-center text-dark_moss_green-400">Listado de productos</h2>
              <p className="text-center text-gray-600">Listar y filtrar todos los productos</p>
            </Link>
          </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
            <Link href="/dashboard/orders" className="block select-none">
              <FaClipboardList className="text-4xl text-dark_moss_green-400 mx-auto mb-4" />
              <h2 className="text-xl text-center text-dark_moss_green-400">Pedidos</h2>
              <p className="text-center text-gray-600">Generar pedidos</p>
            </Link>
          </div>
        </div>

        {/* Gráfico de Productos (Placeholder) */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full">
          <h3 className="text-2xl font-semibold text-dark_moss_green-400 mb-4">Gráfico de Productos</h3>
          <div className="w-full h-64 bg-gray-200 rounded-lg flex justify-center items-center">
            <p className="text-gray-500">Gráfico de productos - Placeholder</p>
          </div>
        </div>

        {/* Últimos Pedidos */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full">
          <h3 className="text-2xl font-semibold text-dark_moss_green-400 mb-4">Últimos Pedidos</h3>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left text-dark_moss_green-400">Fecha</th>
                <th className="px-4 py-2 text-left text-dark_moss_green-400">Día</th>
                <th className="px-4 py-2 text-left text-dark_moss_green-400">Total</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="px-4 py-2">{order.date}</td>
                  <td className="px-4 py-2">{order.day}</td>
                  <td className="px-4 py-2">{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
