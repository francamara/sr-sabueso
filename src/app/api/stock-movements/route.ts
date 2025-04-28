// src/app/api/stock-movements/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adjustStock } from "@/lib/stockService";
import { MovementTypeEnum } from "@/types/movementType";
import { z } from "zod";

/* ----------- POST ----------- */
const BodySchema = z.object({
    productId: z.number().int().positive(),
    movementType: z.nativeEnum(MovementTypeEnum),
    change: z.number().int().refine((n) => n !== 0, { message: "change cannot be zero" }),
    referenceId: z.number().int().optional(),
});

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const allowedRoles = ["admin", "depositmanager"];
    if (!allowedRoles.includes(session.user.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let data: z.infer<typeof BodySchema>;
    try {
        data = BodySchema.parse(await req.json());
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }

    try {
        const product = await adjustStock({
            productId: data.productId,
            userId: +session.user.id,
            movementType: data.movementType,
            change: data.change,
            referenceId: data.referenceId,
        });
        return NextResponse.json(product);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}

/* ----------- GET ----------- */
/**
 * /api/stock-movements?productId=42&limit=100
 */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    /* Validamos y casteamos query params */
    const QuerySchema = z.object({
        productId: z.string().transform((v) => parseInt(v)).optional(),
        limit: z.string().transform((v) => parseInt(v)).optional(),
    });
    const { productId, limit } = QuerySchema.parse({
        productId: searchParams.get("productId") ?? undefined,
        limit: searchParams.get("limit") ?? undefined,
    });

    const movements = await prisma.stockMovement.findMany({
        where: productId ? { product_id: productId } : undefined,
        orderBy: { created_at: "desc" },
        take: limit ?? 50,
        include: {
            movement_type: true,
            user: { select: { username: true } },
        },
    });

    return NextResponse.json(movements);
}
