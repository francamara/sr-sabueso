"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/* ---------- Tipos ---------- */
interface Role {
    id: number;
    name: string;
}

interface NewUserInput {
    username: string;
    email: string;
    phone_number: string;
    password: string;
    role_id: string; // keep as string for <select>, convert to number on submit
}

/* ---------- Estado inicial ---------- */
const initialState: NewUserInput = {
    username: "",
    email: "",
    phone_number: "",
    password: "",
    role_id: "", // sin selección
};

export default function NewUserPage() {
    const router = useRouter();

    const [formData, setFormData] = useState<NewUserInput>(initialState);
    const [roles, setRoles] = useState<Role[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    /* ---------- Cargar roles ---------- */
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get("/api/roles");
                setRoles(res.data);
            } catch (err) {
                console.error("Error al cargar roles", err);
            }
        })();
    }, []);

    /* ---------- Handlers ---------- */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        // Validación mínima
        if (!formData.username.trim()) {
            setErrorMsg("El nombre de usuario es obligatorio");
            return;
        }
        if (!formData.role_id) {
            setErrorMsg("Selecciona un rol");
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post("/api/users", {
                username: formData.username.trim(),
                email: formData.email.trim() || null,
                phone_number: formData.phone_number.trim() || null,
                password: formData.password || null,
                role_id: Number(formData.role_id),
            });

            // Redirige a la lista
            router.push("/dashboard/users");
        } catch (err: any) {
            console.error("Error creando usuario", err);
            const msg = err?.response?.data?.error ?? "Error inesperado";
            setErrorMsg(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ---------- Render ---------- */
    return (
        <div className="flex flex-col items-center min-h-screen bg-old_lace-600 text-dark_moss_green-500 px-4 py-10">
            <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md border border-gray-200">
                <h1 className="text-2xl font-semibold mb-6 text-center">Crear nuevo usuario</h1>

                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
                    {/* Campos señuelo para combatir el autocompletado agresivo de Chrome */}
                    <input type="text" name="fake_username" autoComplete="username" className="hidden" />
                    <input type="password" name="fake_password" autoComplete="new-password" className="hidden" />

                    <div>
                        <label className="block mb-1 font-medium" htmlFor="username">
                            Nombre de usuario <span className="text-red-600">*</span>
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                            placeholder="Sabueso Rodriguez"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="new-username"
                            readOnly
                            onFocus={(e) => e.currentTarget.removeAttribute("readOnly")}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                            placeholder="usuario@ejemplo.com"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium" htmlFor="phone_number">
                            Teléfono
                        </label>
                        <input
                            id="phone_number"
                            name="phone_number"
                            type="tel"
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                            placeholder="11 1234‑5678"
                            value={formData.phone_number}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Déjalo vacío si quieres enviar un email de invitación más tarde.
                        </p>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium" htmlFor="role_id">
                            Rol <span className="text-red-600">*</span>
                        </label>
                        <select
                            id="role_id"
                            name="role_id"
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                            value={formData.role_id}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona un rol</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center items-center gap-2 py-3 rounded-lg font-semibold text-white bg-dark_moss_green-500 hover:bg-dark_moss_green-600 disabled:opacity-60 transition-colors"
                    >
                        {isSubmitting && <Loader2 className="animate-spin w-5 h-5" />}
                        Crear usuario
                    </button>
                </form>
            </div>
        </div>
    );
}
