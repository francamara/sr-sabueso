import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Record<string, string> } // ✅ Corrección aquí
) {
  try {
    const productId = params.productId;

    if (!productId) {
      return NextResponse.json({ message: "Falta el productId en la URL" }, { status: 400 });
    }

    // Buscar en la base de datos
    const product = await prisma.product.findUnique({
      where: { uniqueCode: productId },
    });

    if (!product) {
      return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error en la API de productos:", error);
    return NextResponse.json({ message: "Error al obtener el producto", error }, { status: 500 });
  }
}
