"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";

/* ---------- Tipos ---------- */
type Role = { id: number; name: string };

type User = {
    id: number;
    username: string;
    phone_number: string | null;
    email: string | null;
    role_id: number;
    created_at: string;
};

type UserAddress = { id: number; address: string };

/* ---------- Configuración de tabla ---------- */
const tableHeaders = [
    { key: "username", label: "Nombre" },
    { key: "phone_number", label: "Telefono" },
    { key: "email", label: "Email" },
    { key: "created_at", label: "Fecha de alta" },
] as const;

/* ---------- Colores de roles ---------- */
const roleColors: { [key: number]: string } = {
    1: "bg-red-200 text-red-800", // admin
    2: "bg-blue-200 text-blue-800", // depositmanager
    3: "bg-green-200 text-green-800", // delivery
    4: "bg-purple-200 text-purple-800", // client
};

/* ---------- Utilidades ---------- */
const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

/* ---------- Componente ---------- */
export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);

    const [searchName, setSearchName] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [selectedRole, setSelectedRole] = useState("");

    const [sortField, setSortField] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

    const [isLoading, setIsLoading] = useState(true);


    /* ---------- Modal ---------- */

    const [editingUser, setEditingUser] = useState<User | null>(null);

    const [addresses, setAddresses] = useState<UserAddress[]>([]);

    const [formData, setFormData] = useState<Omit<User, "id" | "created_at">>({
        username: "",
        phone_number: "",
        email: "",
        role_id: 4,
    });

    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

    const closeModal = () => {
        setEditingUser(null);
        setAddresses([]);
        setMsg(null);
    };

    /* ---------- Cargar datos ---------- */
    useEffect(() => {
        (async () => {
            try {
                const [usersRes, rolesRes] = await Promise.all([
                    axios.get("/api/users"),
                    axios.get("/api/roles"),
                ]);
                setUsers(usersRes.data);
                setFilteredUsers(usersRes.data);
                setRoles(rolesRes.data);
            } catch (err) {
                console.error("Error al cargar usuarios:", err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    /* ---------- Filtrado + ordenamiento ---------- */
    useEffect(() => {
        if (!Array.isArray(users)) return;

        let filtered = [...users];

        if (searchName.trim())
            filtered = filtered.filter((u) =>
                u.username.toLowerCase().includes(searchName.toLowerCase()),
            );

        if (searchEmail.trim())
            filtered = filtered.filter((u) =>
                u.email?.toLowerCase().includes(searchEmail.toLowerCase()),
            );

        if (selectedRole)
            filtered = filtered.filter((u) => u.role_id === +selectedRole);

        if (sortField && sortOrder) {
            filtered.sort((a, b) => {
                const aVal = a[sortField as keyof User];
                const bVal = b[sortField as keyof User];

                if (typeof aVal === "string" && typeof bVal === "string") {
                    return sortOrder === "asc"
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal);
                }
                return 0;
            });
        }

        setFilteredUsers(filtered);
    }, [searchName, searchEmail, selectedRole, users, sortField, sortOrder]);


    /* ---------- Abrir modal: cargar datos + direcciones ---------- */

    const openModal = async (u: User) => {

        setEditingUser(u);

        setFormData({

            username: u.username,

            phone_number: u.phone_number ?? "",

            email: u.email ?? "",

            role_id: u.role_id,

        });

        try {

            const res = await axios.get(`/api/users/${u.id}/addresses`);

            setAddresses(res.data as UserAddress[]);

        } catch (err) {

            console.error("Error al obtener direcciones:", err);

            setAddresses([]);

        }

    };

    /* ---------- Helpers ---------- */
    const handleSortClick = (field: string) => {
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


    /* ---------- Guardar cambios ---------- */

    const handleSave = async () => {

        if (!editingUser) return;

        setSaving(true);

        setMsg(null);

        try {

            await axios.put("/api/users", { id: editingUser.id, ...formData });

            await axios.put(`/api/users/${editingUser.id}/addresses`, {

                addresses: addresses.map((a) => a.address.trim()).filter(Boolean),

            });

            // refrescar lista principal

            const updated = await axios.get("/api/users");

            setUsers(updated.data);

            setFilteredUsers(updated.data);

            setMsg({ ok: true, text: "Usuario actualizado 👍" });

        } catch (err: any) {

            console.error(err);

            setMsg({ ok: false, text: err.response?.data?.error ?? "Error al guardar" });

        } finally {

            setSaving(false);

        }

    };

    const getRoleName = (id: number) => roles.find((r) => r.id === id)?.name ?? "-";

    const getArrow = (field: string) =>
        sortField === field ? (sortOrder === "asc" ? " 🔼" : " 🔽") : "";

    /* ---------- UI ---------- */
    if (isLoading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-soft_brown-100 text-dark_moss_green-400">
                <div className="text-xl font-semibold animate-pulse">Cargando usuarios...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen pb-20 px-6 bg-old_lace-600 text-dark_moss_green-500 font-sans">
            {/* Filtros */}
            <div className="flex flex-wrap gap-4 w-full bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <input
                    type="text"
                    className="p-3 border border-gray-300 rounded-lg shadow-sm"
                    placeholder="Buscar por nombre"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <input
                    type="text"
                    className="p-3 border border-gray-300 rounded-lg shadow-sm"
                    placeholder="Buscar por email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                />
                <select
                    title="Seleccionar Rol"
                    className="p-3 border border-gray-300 rounded-lg shadow-sm"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    <option value="">Filtrar por Rol</option>
                    {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto w-full mt-8">
                {filteredUsers.length > 0 ? (
                    <div className="rounded-xl shadow-lg overflow-hidden border border-gray-200">
                        <table className="min-w-full bg-white text-sm text-left text-gray-700">
                            <thead className="bg-dark_moss_green-500 text-white text-sm select-none">
                                <tr>
                                    <th className="p-4 cursor-pointer" onClick={() => handleSortClick("role_id")}>Rol{getArrow("role_id")}</th>
                                    {tableHeaders.map((h) => (
                                        <th
                                            key={h.key}
                                            className="p-4 cursor-pointer"
                                            onClick={() => handleSortClick(h.key)}
                                        >
                                            {h.label}
                                            {getArrow(h.key)}
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
                                                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${roleColors[u.role_id] ?? "bg-gray-200 text-gray-700"}`}
                                            >
                                                {getRoleName(u.role_id)}
                                            </span>
                                        </td>
                                        {tableHeaders.map((h) => (
                                            <td key={h.key} className="p-4 border-t">
                                                {h.key === "created_at" ? formatDate(u.created_at) : (u[h.key as keyof User] as string)}
                                            </td>
                                        ))}
                                        <td className="p-4 border-t text-center">
                                            <Pencil
                                                className="w-4 h-4 cursor-pointer text-dark_moss_green-400 hover:text-dark_moss_green-600"
                                                onClick={() => setEditingUser(u)}
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

            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative animate-fade-in">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                            onClick={closeModal}
                            aria-label="Cerrar"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-semibold mb-4">
                            Editar usuario – {editingUser.username}
                        </h2>

                        {/* Mensajes */}
                        {msg && (
                            <div
                                className={`mb-4 p-3 rounded-lg text-sm ${msg.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        )}
                        {/* Formulario usuario */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre de usuario</label>
                                <input
                                    className="w-full p-2 border rounded-lg"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Teléfono</label>
                                <input
                                    className="w-full p-2 border rounded-lg"
                                    value={formData.phone_number ?? ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone_number: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full p-2 border rounded-lg"
                                    value={formData.email ?? ""}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Rol</label>
                                <select
                                    className="w-full p-2 border rounded-lg"
                                    value={formData.role_id}
                                    onChange={(e) =>
                                        setFormData({ ...formData, role_id: +e.target.value })
                                    }
                                >
                                    {roles.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Direcciones */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-2">
                                    Direcciones
                                </label>
                                {addresses.map((addr, idx) => (
                                    <div key={addr.id ?? idx} className="flex items-center gap-2 mb-2">
                                        <input
                                            className="flex-1 p-2 border rounded-lg"
                                            value={addr.address}
                                            onChange={(e) => {
                                                const upd = [...addresses];
                                                upd[idx].address = e.target.value;
                                                setAddresses(upd);
                                            }}
                                        />
                                        <Trash2
                                            className="w-4 h-4 text-red-500 cursor-pointer"
                                            onClick={() =>
                                                setAddresses(addresses.filter((_, i) => i !== idx))
                                            }
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="flex items-center gap-1 text-sm text-dark_moss_green-500 hover:underline mt-2"
                                    onClick={() => setAddresses([...addresses, { id: 0, address: "" }])}
                                >
                                    <Plus className="w-4 h-4" />
                                    Agregar dirección
                                </button>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                className="px-4 py-2 rounded-lg border text-dark_moss_green-500 hover:bg-dark_moss_green-50"
                                onClick={closeModal}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg bg-dark_moss_green-500 text-white flex items-center gap-2 disabled:opacity-60"
                                disabled={saving || !formData.username.trim()}
                                onClick={handleSave}
                            >
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}