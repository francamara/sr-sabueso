import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic"; // evita que Next intente volverlo estático
export const revalidate = 0;            // refuerza que NO se cachee

/* ------------------------------------------------------------------
   GET /api/users/:id   — devuelve user + addresses
-------------------------------------------------------------------*/
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const userId = Number(params.id)
    if (Number.isNaN(userId)) {
        return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                phone_number: true,
                email: true,
                role_id: true,
                created_at: true,
                addresses: {
                    select: { id: true, address: true, created_at: true },
                    orderBy: { id: "asc" },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (err) {
        console.error("GET /api/users/:id error:", err);
        return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 });
    }
}

/* ------------------------------------------------------------------
   PUT /api/users/:id
   Body JSON (todos opcionales):
   {
     "username"?:      string
     "email"?:         string | null
     "phone_number"?:  string | null
     "role_id"?:       number
     "password"?:      string
     "addresses"?:     string[]      // lista completa (se reemplaza)
   }
-------------------------------------------------------------------*/
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const userId = Number(params.id);
    if (Number.isNaN(userId)) {
        return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }

    /* ---------- Construir objeto de actualización del usuario ---------- */
    const data: Parameters<typeof prisma.user.update>[0]["data"] = {};

    if (body.username !== undefined) data.username = String(body.username);
    if (body.email !== undefined) data.email = body.email as string | null;
    if (body.phone_number !== undefined)
        data.phone_number = body.phone_number as string | null;
    if (body.role_id !== undefined)
        data.role = { connect: { id: Number(body.role_id) } };

    if (typeof body.password === "string" && body.password.trim()) {
        data.password = await bcrypt.hash(body.password, 10);
    }

    /* ---------- Preparar direcciones ---------- */
    const newAddresses = Array.isArray(body.addresses)
        ? (body.addresses as string[])
            .map((a) => a.trim())
            .filter(Boolean)
        : undefined;

    if (Object.keys(data).length === 0 && newAddresses === undefined) {
        return NextResponse.json(
            { error: "No hay campos para actualizar" },
            { status: 400 },
        );
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            /** 1· Actualiza datos del usuario (si corresponde) */
            const user =
                Object.keys(data).length > 0
                    ? await tx.user.update({
                        where: { id: userId },
                        data,
                        select: {
                            id: true,
                            username: true,
                            email: true,
                            phone_number: true,
                            role_id: true,
                            created_at: true,
                        },
                    })
                    : null;

            /** 2· Reemplaza direcciones si llegaron en el body */
            let addresses;
            if (newAddresses !== undefined) {
                // borra todas las viejas
                await tx.userAddress.deleteMany({ where: { user_id: userId } });
                // crea las nuevas
                addresses = await tx.userAddress.createMany({
                    data: newAddresses.map((addr) => ({
                        user_id: userId,
                        address: addr,
                    })),
                    skipDuplicates: true,
                });
            }

            return { user, addressesCreated: addresses?.count };
        });

        return NextResponse.json(result);
    } catch (err: any) {
        console.error("PUT /api/users/:id error:", err);

        if (err.code === "P2002") {
            const campos = err.meta?.target?.join(", ");
            return NextResponse.json(
                { error: `Valor duplicado en ${campos}` },
                { status: 409 },
            );
        }

        return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
    }
}