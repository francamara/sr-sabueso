"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";

/* ------------------------------------------------------------------
   Tipos                                                         
-------------------------------------------------------------------*/
interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    username: string;
    phone_number: string | null;
    email: string | null;
    role_id: number;
    created_at: string; // ISO
}

interface UserAddress {
    id: number;
    address: string;
}

interface UserDetail extends User {
    addresses: UserAddress[];
}

/* ------------------------------------------------------------------
   Constantes                                                        
-------------------------------------------------------------------*/
const TABLE_HEADERS = [
    { key: "username", label: "Nombre" },
    { key: "phone_number", label: "Telefono" },
    { key: "email", label: "Email" },
    { key: "created_at", label: "Fecha de alta" },
] as const;

type HeaderKey = (typeof TABLE_HEADERS)[number]["key"] | "role_id";

type SortOrder = "asc" | "desc" | null;

const ROLE_COLORS: Record<number, string> = {
    1: "bg-red-200 text-red-800", // admin
    2: "bg-blue-200 text-blue-800", // depositmanager
    3: "bg-green-200 text-green-800", // delivery
    4: "bg-purple-200 text-purple-800", // client
};

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

/* ------------------------------------------------------------------
   Componente principal                                              
-------------------------------------------------------------------*/
export default function UsersPage() {
    /* ---------------- estado global ---------------- */
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    /* ---------------- filtros & orden ---------------- */
    const [searchName, setSearchName] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [sortField, setSortField] = useState<HeaderKey | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>(null);

    /* ---------------- modal ---------------- */
    const [editingUser, setEditingUser] = useState<UserDetail | null>(null);
    const [formData, setFormData] = useState<Omit<User, "id" | "created_at">>();
    const [addresses, setAddresses] = useState<UserAddress[]>([]);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

    /* ---------------- carga inicial ---------------- */
    useEffect(() => {
        (async () => {
            try {
                const [uRes, rRes] = await Promise.all([
                    axios.get<User[]>("/api/users"),
                    axios.get<Role[]>("/api/roles"),
                ]);
                setUsers(uRes.data);
                setRoles(rRes.data);
            } catch (err) {
                console.error("Error inicial:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    /* ---------------- derivados ---------------- */
    const filteredUsers = useMemo(() => {
        let list = [...users];

        if (searchName.trim()) {
            list = list.filter((u) =>
                u.username.toLowerCase().includes(searchName.toLowerCase()),
            );
        }

        if (searchEmail.trim()) {
            list = list.filter((u) =>
                u.email?.toLowerCase().includes(searchEmail.toLowerCase()),
            );
        }

        if (selectedRole) list = list.filter((u) => u.role_id === +selectedRole);

        if (sortField && sortOrder) {
            list.sort((a, b) => {
                const aVal = a[sortField as keyof User] as string;
                const bVal = b[sortField as keyof User] as string;
                return sortOrder === "asc"
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            });
        }

        return list;
    }, [users, searchName, searchEmail, selectedRole, sortField, sortOrder]);

    /* ---------------- helpers tabla ---------------- */
    const getRoleName = (id: number) => roles.find((r) => r.id === id)?.name ?? "-";

    const toggleSort = (field: HeaderKey) => {
        setSortField((prev) => (prev !== field ? field : null));
        setSortOrder((prev) =>
            sortField !== field ? "desc" : prev === "desc" ? "asc" : null,
        );
    };

    const arrow = (field: HeaderKey) =>
        sortField === field ? (sortOrder === "asc" ? " 🔼" : " 🔽") : "";

    /* ---------------- modal handlers ---------------- */
    const openModal = useCallback(async (u: User) => {
        try {
            const res = await axios.get<UserDetail>(`/api/users/${u.id}`);
            const full = res.data;
            setEditingUser(full);
            setFormData({
                username: full.username,
                phone_number: full.phone_number ?? "",
                email: full.email ?? "",
                role_id: full.role_id,
            });
            setAddresses(full.addresses);
            setMsg(null);
        } catch (e) {
            console.error("Error al obtener detalle:", e);
        }
    }, []);

    const closeModal = () => {
        setEditingUser(null);
        setAddresses([]);
        setMsg(null);
    };

    const handleSave = useCallback(async () => {
        if (!editingUser) return;

        setSaving(true);
        setMsg(null);

        try {
            await axios.put(`/api/users/${editingUser.id}`, {
                ...formData,
                addresses: addresses.map((a) => a.address.trim()).filter(Boolean),
            });

            // refrescar la lista principal
            const refreshed = await axios.get<User[]>("/api/users");
            setUsers(refreshed.data);

            setMsg({ ok: true, text: "Usuario actualizado 👍" });
            closeModal();               // opcional: cierra el modal tras guardar
        } catch (err: any) {
            setMsg({ ok: false, text: err.response?.data?.error ?? "Error al guardar" });
        } finally {
            setSaving(false);
        }
    }, [editingUser, formData, addresses]);


    /* ------------------------------------------------------------------
       Render                                                            
    -------------------------------------------------------------------*/
    if (loading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-soft_brown-100 text-dark_moss_green-400">
                <div className="text-xl font-semibold animate-pulse">Cargando usuarios…</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen pb-20 px-6 bg-old_lace-600 text-dark_moss_green-500 font-sans">
            {/* ---------------- Filtros ---------------- */}
            <div className="flex flex-wrap gap-4 w-full bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <input
                    className="p-3 border border-gray-300 rounded-lg shadow-sm"
                    placeholder="Buscar por nombre"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <input
                    className="p-3 border border-gray-300 rounded-lg shadow-sm"
                    placeholder="Buscar por email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                />
                <select
                    className="p-3 border border-gray-300 rounded-lg shadow-sm"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    <option value="">Filtrar por Rol</option>
                    {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                            {r.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* ---------------- Tabla (intacta) ---------------- */}
            <div className="overflow-x-auto w-full mt-8">
                {filteredUsers.length ? (
                    <div className="rounded-xl shadow-lg overflow-hidden border border-gray-200">
                        <table className="min-w-full bg-white text-sm text-left text-gray-700">
                            <thead className="bg-dark_moss_green-500 text-white text-sm select-none">
                                <tr>
                                    <th className="p-4 cursor-pointer" onClick={() => toggleSort("role_id")}>Rol{arrow("role_id")}</th>
                                    {TABLE_HEADERS.map((h) => (
                                        <th
                                            key={h.key}
                                            className="p-4 cursor-pointer"
                                            onClick={() => toggleSort(h.key as HeaderKey)}
                                        >
                                            {h.label}
                                            {arrow(h.key as HeaderKey)}
                                        </th>
                                    ))}
                                    <th className="p-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 border-t">
                                            <span
                                                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[u.role_id] ?? "bg-gray-200 text-gray-700"}`}
                                            >
                                                {getRoleName(u.role_id)}
                                            </span>
                                        </td>
                                        {TABLE_HEADERS.map((h) => (
                                            <td key={h.key} className="p-4 border-t">
                                                {h.key === "created_at" ? formatDate(u.created_at) : (u[h.key as keyof User] as string)}
                                            </td>
                                        ))}
                                        <td className="p-4 border-t text-center">
                                            <Pencil
                                                className="w-4 h-4 cursor-pointer text-dark_moss_green-400 hover:text-dark_moss_green-600"
                                                onClick={() => openModal(u)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 mt-8">No hay usuarios para mostrar</div>
                )}
            </div>

            {/* ---------------- Modal ---------------- */}
            {editingUser && formData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative animate-fade-in">
                        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={closeModal}>
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-lg font-semibold mb-4">
                            Editar usuario – {editingUser.username}
                        </h2>

                        {msg && (
                            <div className={`mb-4 p-3 rounded-lg text-sm ${msg.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{msg.text}</div>
                        )}

                        {/* ----------- formulario ----------- */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium">
                                <span>Nombre de usuario</span>
                                <input className="w-full p-2 border rounded-lg mt-1" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                            </label>

                            <label className="block text-sm font-medium">
                                <span>Teléfono</span>
                                <input className="w-full p-2 border rounded-lg mt-1" value={formData.phone_number ?? ""} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} />
                            </label>

                            <label className="block text-sm font-medium">
                                <span>Email</span>
                                <input type="email" className="w-full p-2 border rounded-lg mt-1" value={formData.email ?? ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </label>

                            <label className="block text-sm font-medium">
                                <span>Rol</span>
                                <select className="w-full p-2 border rounded-lg mt-1" value={formData.role_id} onChange={(e) => setFormData({ ...formData, role_id: +e.target.value })}>
                                    {roles.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {/* direcciones */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Direcciones</label>
                                {addresses.map((addr, idx) => (
                                    <div key={addr.id ?? idx} className="flex items-center gap-2 mb-2">
                                        <input className="flex-1 p-2 border rounded-lg" value={addr.address} onChange={(e) => {
                                            const copy = [...addresses];
                                            copy[idx].address = e.target.value;
                                            setAddresses(copy);
                                        }} />
                                        <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" onClick={() => setAddresses(addresses.filter((_, i) => i !== idx))} />
                                    </div>
                                ))}
                                <button type="button" className="flex items-center gap-1 text-sm text-dark_moss_green-500 hover:underline mt-2" onClick={() => setAddresses([...addresses, { id: 0, address: "" }])}>
                                    <Plus className="w-4 h-4" /> Agregar dirección
                                </button>
                            </div>
                        </div>

                        {/* ----------- botones ----------- */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button className="px-4 py-2 rounded-lg border text-dark_moss_green-500 hover:bg-dark_moss_green-50" onClick={closeModal}>Cancelar</button>
                            <button className="px-4 py-2 rounded-lg bg-dark_moss_green-500 text-white flex items-center gap-2 disabled:opacity-60" disabled={saving || !formData.username.trim()} onClick={handleSave}>
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />} Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
