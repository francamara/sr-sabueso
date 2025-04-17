import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { description: "asc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const {
      description,
      sku,
      weight,
      extra_weight,
      retail_price,
      stock,
      barcode,
      wholesale_price,
      brand_id,
      animal_id,
      product_line_id,
      sub_product_line_id,
      animal_age_id,
      animal_size_id,
    } = await req.json();

    const missingFields: string[] = [];
    if (!description) missingFields.push("description");
    if (!sku) missingFields.push("sku");
    if (weight == null) missingFields.push("weight");
    if (retail_price == null) missingFields.push("retail_price");
    if (stock == null) missingFields.push("stock");
    if (barcode == null) missingFields.push("barcode");
    if (wholesale_price == null) missingFields.push("wholesale_price");
    if (brand_id == null) missingFields.push("brand_id");
    if (animal_id == null) missingFields.push("animal_id");
    if (product_line_id == null) missingFields.push("product_line_id");
    if (animal_age_id == null) missingFields.push("animal_age_id");

    if (missingFields.length > 0) {
      console.error("⛔ Campos faltantes:", missingFields);
      return NextResponse.json(
        { error: "Faltan campos obligatorios", missingFields },
        { status: 400 }
      );
    }

    // Obtener datos relacionados
    const [brand, line, animal, age, size, subline] = await Promise.all([
      prisma.brand.findUnique({ where: { id: brand_id } }),
      prisma.productLine.findUnique({ where: { id: product_line_id } }),
      prisma.animal.findUnique({ where: { id: animal_id } }),
      prisma.animalAge.findUnique({ where: { id: animal_age_id } }),
      animal_size_id ? prisma.animalSize.findUnique({ where: { id: animal_size_id } }) : null,
      sub_product_line_id
        ? prisma.subProductLine.findUnique({ where: { id: sub_product_line_id } })
        : null,
    ]);

    if (!brand || !line || !animal || !age) {
      return NextResponse.json(
        { error: "Faltan datos de referencia obligatorios" },
        { status: 400 }
      );
    }

    if (sub_product_line_id && !subline) {
      return NextResponse.json({ error: "SubProductLine no encontrada" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        description,
        sku,
        weight,
        extra_weight,
        retail_price,
        wholesale_price,
        barcode,
        stock,
        brand: { connect: { id: brand_id } },
        animal: { connect: { id: animal_id } },
        product_line: { connect: { id: product_line_id } },
        animal_age: { connect: { id: animal_age_id } },
        ...(animal_size_id ? { animal_sizes: { connect: [{ id: animal_size_id }] } } : {}),
        ...(sub_product_line_id
          ? { subProductLine: { connect: { id: sub_product_line_id } } }
          : {}),
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("❌ Error creando producto:", error);
    return new NextResponse("Error creando producto", { status: 500 });
  }
}
