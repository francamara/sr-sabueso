import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
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

    // Obtener el cuerpo de la solicitud (datos para actualizar)
    const {
      weight,
      extra_weight,
      retail_price,
      stock,
      barcode,
      wholesale_price,
      brand_id,
      animal_id,
      product_line_id,
      animal_age_id,
      animal_size_id,
    } = await req.json();

    // Verificar que los campos obligatorios estén presentes
    if (
      !weight ||
      !retail_price ||
      !stock ||
      !barcode ||
      !wholesale_price ||
      !brand_id ||
      !animal_id ||
      !product_line_id ||
      !animal_age_id
    ) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Actualizar el producto en la base de datos
    const updatedProduct = await prisma.product.update({
      where: { sku: productId }, // Asegúrate de que 'sku' sea único
      data: {
        weight,
        extra_weight,
        retail_price,
        wholesale_price,
        barcode,
        stock,
        brand: { connect: { id: brand_id } },
        animal: { connect: { id: animal_id } },
        productLine: { connect: { id: product_line_id } },
        animalAge: { connect: { id: animal_age_id } },
        ...(animal_size_id ? { animalSize: { connect: { id: animal_size_id } } } : {}),
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
