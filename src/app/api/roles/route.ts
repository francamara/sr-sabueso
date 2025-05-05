import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // evita caché automática (opcional)

// GET /api/roles  — devuelve todos los roles disponibles
export async function GET() {
    try {
        const roles = await prisma.role.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: { id: "asc" },
        });

        return NextResponse.json(roles);
    } catch (err) {
        console.error("GET /api/roles error:", err);
        return NextResponse.json(
            { error: "Error al obtener roles" },
            { status: 500 },
        );
    }
}
