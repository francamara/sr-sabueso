import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateProductCode } from "../../utils/utils";

const prisma = new PrismaClient();

// Función para generar un código único de 8 dígitos
async function generateUniqueProductCode() {
  let uniqueCode;
  let exists = true;

  while (exists) {
    uniqueCode = generateProductCode();
    const existingProduct = await prisma.product.findUnique({
      where: { uniqueCode },
    });
    exists = !!existingProduct;
  }

  return uniqueCode;
}

console.log(generateUniqueProductCode())

// ✅ Exporta GET para obtener productos
// eslint-ignore-next-line 
export async function GET(req: NextRequest) {
  console.log(req)
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
    const { name, description, weight, listPrice, retailPrice, stock, barcode, animalId, uniqueCode, lineId, brandId, factoryId } = body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        weight,
        listPrice,
        retailPrice,
        stock,
        barcode,
        uniqueCode,
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
