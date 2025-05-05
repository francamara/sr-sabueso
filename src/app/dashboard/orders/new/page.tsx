"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { User } from "@/models";

/* ---------- Tipos ---------- */
type Product = { id: number; description: string; sku: string; retail_price: number };
type OrderItemForm = { product_id: string; quantity: string };

/* ---------- Componente ---------- */
export default function NewOrderPage() {
  const router = useRouter();

  /* catálogos */
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  /* flags */
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* form */
  const [formData, setFormData] = useState({
    user_id: "",
    address_id: "",
    status: "pending",
    items: [] as OrderItemForm[],
  });

  /* ---------- cargar usuarios ---------- */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get<User[]>("/api/users");
        setUsers(data);                      // ✅ User[]
      } catch (err) {
        console.error("Error cargando usuarios:", err);
      }
    })();
  }, []);

  /* ---------- cargar productos ---------- */
  useEffect(() => {
    (async () => {
      try {
        // 👉 se pega al endpoint GET /api/products
        const { data } = await axios.get("/api/products");
        setProducts(data);
      } catch (err) {
        console.error("Error cargando productos:", err);
      }
    })();
  }, []);

  /* ---------- helpers ---------- */
  const addItem = () =>
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { product_id: "", quantity: "" }],
    }));

  const removeItem = (idx: number) =>
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));

  const handleItemChange = (idx: number, field: keyof OrderItemForm, value: string) =>
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    }));

  const subtotal = useCallback(() => {
    return formData.items.reduce((sum, item) => {
      const prod = products.find((p) => p.id === +item.product_id);
      const qty = parseInt(item.quantity) || 0;
      return sum + (prod ? prod.retail_price * qty : 0);
    }, 0);
  }, [formData.items, products]);

  /* ---------- handlers ---------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("/api/orders", {
        user_id: +formData.user_id,
        address_id: +formData.address_id,
        status: formData.status,
        items: formData.items.map((it) => ({
          product_id: +it.product_id,
          quantity: parseInt(it.quantity),
        })),
      });
      router.push("/dashboard/orders");
    } catch (err) {
      console.error("Error creando orden:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- render ---------- */
  return (
    <div className="w-full h-full flex justify-center items-center text-dark_moss_green-400 px-6">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-screen-xl bg-white rounded-xl p-8 shadow-lg"
      >
        <h1 className="sm:col-span-2 lg:col-span-3 text-3xl font-bold mb-4">Nuevo Pedido</h1>

        {/* Cliente y dirección */}
        <SelectField
          label="Cliente"
          name="user_id"
          value={formData.user_id}
          onChange={handleChange}
          options={users.map((u) => ({ id: u.id, name: u.username }))}
        />
        <SelectField
          label="Dirección"
          name="address_id"
          value={formData.address_id}
          onChange={handleChange}
          disabled={!formData.user_id}
          options={
            (users.find(u => +u.id === +formData.user_id)?.addresses || [])
              .map(addr => ({ id: addr.id, name: addr.address }))
          } />
        {/* Items header */}
        <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-between mt-6">
          <h2 className="text-xl font-semibold">Items</h2>
          <button
            type="button"
            onClick={addItem}
            className="bg-dark_moss_green-500 hover:bg-dark_moss_green-600 text-white px-4 py-2 rounded text-sm shadow"
          >
            + Agregar ítem
          </button>
        </div>

        {/* Items rows */}
        {formData.items.map((item, idx) => (
          <div key={idx} className="sm:col-span-2 lg:col-span-3 grid grid-cols-6 gap-3 items-end">
            <div className="col-span-4">
              <SelectField
                label={`Producto #${idx + 1}`}
                name="product_id"
                value={item.product_id}
                onChange={(e) => handleItemChange(idx, "product_id", e.target.value)}
                options={products.map((p) => ({
                  id: p.id,
                  name: `${p.sku} — ${p.description}`,
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Cantidad</label>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                className="w-full px-3 py-2 border border-dark_moss_green-200 rounded-md"
                required
                aria-label="Cantidad"
                placeholder="Cantidad"
              />
            </div>
            <div className="flex justify-end pb-1">
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Quitar
              </button>
            </div>
          </div>
        ))}

        {/* Subtotal */}
        <div className="sm:col-span-2 lg:col-span-3 flex justify-end text-lg font-mono mt-4">
          Subtotal: ${subtotal().toLocaleString()}
        </div>

        {/* Submit */}
        <div className="sm:col-span-2 lg:col-span-3 flex justify-center mt-6">
          {isSubmitting ? (
            <LoadingSpinner size={28} color="#4b5d44" />
          ) : (
            <button
              type="submit"
              disabled={formData.items.length === 0}
              className="bg-dark_moss_green-500 hover:bg-dark_moss_green-600 text-white px-6 py-3 rounded text-lg shadow transition-all disabled:opacity-50"
            >
              Crear Orden
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

/* ---------- Select reutilizable ---------- */
function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  disabled = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { id: number; name: string }[];
  disabled?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-3 py-2 border border-dark_moss_green-200 rounded-md disabled:bg-gray-100 disabled:text-gray-400"
        required
      >
        <option value="">Seleccionar {label.toLowerCase()}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
