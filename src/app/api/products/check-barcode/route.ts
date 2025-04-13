import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const barcode = searchParams.get("barcode");

  if (!barcode) {
    return NextResponse.json({ error: "Barcode requerido" }, { status: 400 });
  }

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { barcode },
    });

    return NextResponse.json(existingProduct || null);
  } catch (error) {
    console.error("Error checking barcode:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
