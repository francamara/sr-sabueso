import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ---------- GET /api/products/[productId] ---------- */
export async function GET(
  _req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    if (!productId) {
      return NextResponse.json(
        { message: "Falta el productId en la URL" },
        { status: 400 }
      );
    }

    /* Permitimos buscar tanto por id numérico como por SKU */
    const whereClause =
      /^\d+$/.test(productId)
        ? { id: Number(productId) }
        : { sku: productId };

    const product = await prisma.product.findUnique({
      where: whereClause,
      include: {
        brand: true,
        animal: true,
        product_line: true,
        animal_age: true,
        animal_sizes: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error obteniendo producto:", error);
    return NextResponse.json(
      { message: "Error al obtener el producto", error },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    if (!productId) {
      return NextResponse.json({ message: "Falta el SKU en la URL" }, { status: 400 });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { sku: productId },
    });

    if (!existingProduct) {
      return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 })
    }

    // Obtener el cuerpo de la solicitud (datos para actualizar)
    const {
      retail_price,
      stock,
      wholesale_price,
    } = await req.json();

    // Verificar que los campos obligatorios estén presentes
    if (
      !retail_price ||
      !stock ||
      !wholesale_price
    ) {
      return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
    }

    // Actualizar el producto en la base de datos
    const updatedProduct = await prisma.product.update({
      where: { id: existingProduct.id }, // Asegúrate de que 'sku' sea único
      data: {
        retail_price,
        wholesale_price,
        stock,
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return NextResponse.json(
      { message: "Error al actualizar el producto", error },
      { status: 500 }
    );
  }
}
