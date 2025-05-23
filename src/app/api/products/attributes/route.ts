import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
    const animals = await prisma.animal.findMany({ orderBy: { name: "asc" } });
    const lines = await prisma.productLine.findMany({ orderBy: { name: "asc" } });

    const subProductLines = await prisma.subProductLine.findMany({
      orderBy: { name: "asc" },
      include: { product_line: true }, // 🧩 incluye la línea asociada
    });

    const animalAges = await prisma.animalAge.findMany({ orderBy: { name: "asc" } });
    const animalSizes = await prisma.animalSize.findMany({ orderBy: { name: "asc" } });

    return NextResponse.json({
      brands,
      animals,
      lines,
      subProductLines,
      animalAges,
      animalSizes,
    });
  } catch (error) {
    console.error("Error fetching product attributes:", error);
    return NextResponse.json({ error: "Error fetching attributes" }, { status: 500 });
  }
}
