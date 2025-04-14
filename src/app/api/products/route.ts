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

    const missingFields: string[] = [];
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
    const [brand, line, animal, age, size] = await Promise.all([
      prisma.brand.findUnique({ where: { id: brand_id } }),
      prisma.productLine.findUnique({ where: { id: product_line_id } }),
      prisma.animal.findUnique({ where: { id: animal_id } }),
      prisma.animalAge.findUnique({ where: { id: animal_age_id } }),
      animal_size_id ? prisma.animalSize.findUnique({ where: { id: animal_size_id } }) : null,
    ]);

    if (!brand || !line || !animal || !age) {
      return NextResponse.json({ error: "Faltan datos de referencia" }, { status: 400 });
    }

    // Generar descripción
    const description = `${brand.name} ${line.name} ${animal.name} ${age.name}${
      size ? ` ${size.name}` : ""
    } x${weight}kg`;

    // Generar SKU (iniciales + peso)
    const getInitials = (str: string) =>
      str
        .split(" ")
        .map((word) => word[0]?.toUpperCase() ?? "")
        .join("");

    const skuParts = [
      getInitials(brand.name),
      getInitials(line.name),
      getInitials(animal.name),
      getInitials(age.name),
      size ? getInitials(size.name) : null,
      `${weight}KG`,
    ].filter(Boolean);

    const sku = skuParts.join("-");

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
        productLine: { connect: { id: product_line_id } },
        animalAge: { connect: { id: animal_age_id } },
        ...(animal_size_id ? { animalSize: { connect: { id: animal_size_id } } } : {}),
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("❌ Error creando producto:", error);
    return new NextResponse("Error creando producto", { status: 500 });
  }
}
