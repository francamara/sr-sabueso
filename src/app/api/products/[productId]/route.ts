import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  context: { params: { productId: string } } // Fix the params type
) {
  try {
    const productId = parseInt(context.params.productId, 10);
    console.log("Product ID:", productId);

    if (!productId) {
      return NextResponse.json(
        { message: "Missing productId in URL" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findFirst({
      where: { uniqueCode: { equals: productId } },
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
