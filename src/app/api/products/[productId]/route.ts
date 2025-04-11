import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: {
    productId: string;
  };
};

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const productId = parseInt(params.productId, 10);
    console.log("Product ID:", productId);

    if (!productId) {
      return NextResponse.json(
        { message: "Missing or invalid productId in URL" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findFirst({
      where: { sku: productId.toString() },
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
      { message: "Error al obtener el producto" },
      { status: 500 }
    );
  }
}
