import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Exporta GET para obtener productos
// eslint-ignore-next-line 
export async function GET(req: NextRequest) {
  const request = req
  console.log(request)
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching products", error }, { status: 500 });
  }
}

// ✅ Exporta POST para agregar un producto
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, weight, listPrice, retailPrice, stock, barcode, animalId, lineId, brandId, factoryId } = body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        weight,
        listPrice,
        retailPrice,
        stock,
        barcode,
        animal: { connect: { id: animalId } },
        line: { connect: { id: lineId } },
        brand: { connect: { id: brandId } },
        factory: { connect: { id: factoryId } },
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating product", error }, { status: 500 });
  }
}
