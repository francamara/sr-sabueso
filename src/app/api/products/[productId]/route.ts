import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    if (!productId) {
      return NextResponse.json(
        { message: "Falta el SKU en la URL" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findFirst({
      where: { sku: productId },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error en la API de productos:", error);
    return NextResponse.json(
      { message: "Error al obtener el producto", error },
      { status: 500 }
    );
  }
}
