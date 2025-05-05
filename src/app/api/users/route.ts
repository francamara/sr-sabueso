import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";


export const dynamic = "force-dynamic"; // evita cache en edge si lo necesitas

// GET /api/users  — devuelve todos los usuarios con sus datos básicos
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role_id: true,
                phone_number: true,
                created_at: true,
                addresses: {
                    select: { id: true, address: true, created_at: true },
                    orderBy: { id: "asc" },
                },
            },
            orderBy: { id: "asc" },
        });

        return NextResponse.json(users);
    } catch (err) {
        console.error("GET /api/users error:", err);
        return NextResponse.json(
            { error: "Error al obtener usuarios" },
            { status: 500 },
        );
    }
}

/**
 * POST /api/users
 * Crea un usuario.
 *
 * Body JSON:
 * {
 *   "username":     string   (obligatorio, único)
 *   "role_id":      number   (obligatorio)
 *   "email"?:       string   (único, opcional)
 *   "phone_number"?:string   (único, opcional)
 *   "password"?:    string   (opcional — se hashea si viene)
 * }
 */
export async function POST(req: Request) {
    try {
        const body = (await req.json()) as {
            username?: string;
            role_id?: number;
            email?: string;
            phone_number?: string;
            password?: string;
        };

        /* --------- Validaciones básicas --------- */
        if (!body.username || !body.role_id) {
            return NextResponse.json(
                { error: "username y role_id son obligatorios" },
                { status: 400 },
            );
        }

        const data: Parameters<typeof prisma.user.create>[0]["data"] = {
            username: body.username,
            role: { connect: { id: body.role_id } },
            email: body.email ?? null,
            phone_number: body.phone_number ?? null,
        };

        // Si envía password, se hashea
        if (typeof body.password === "string" && body.password.trim() !== "") {
            data.password = await bcrypt.hash(body.password, 10);
        }

        const user = await prisma.user.create({
            data,
            select: {
                id: true,
                username: true,
                email: true,
                phone_number: true,
                role_id: true,
                created_at: true,
            },
        });

        return NextResponse.json(user, { status: 201 });
    } catch (err: any) {
        console.error("POST /api/users error:", err);

        // Prisma error de unicidad (P2002): username, email o phone_number duplicados
        if (err.code === "P2002") {
            const campos = err.meta?.target?.join(", ") ?? "campo único";
            return NextResponse.json(
                { error: `Ya existe otro usuario con el mismo ${campos}` },
                { status: 409 },
            );
        }

        return NextResponse.json(
            { error: "Error al crear el usuario" },
            { status: 500 },
        );
    }
}