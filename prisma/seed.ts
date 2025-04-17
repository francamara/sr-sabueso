import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  /* ---------- datos base ---------- */
  const roles = ["admin"];
  const animals = ["perro", "gato"];
  const animalAges = ["cachorro", "adulto", "senior"];
  const animalSizes = ["pequeño", "mediano", "grande"];

  // Brand -> líneas
  const brandsWithLines: Record<string, string[]> = {
    Purina: ["Excellent", "Proplan"],
    "Royal Canin": ["Health Nutrition"],
  };

  /* ---------- seed básicos ---------- */
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }

  for (const animal of animals) {
    await prisma.animal.upsert({
      where: { name: animal },
      update: {},
      create: { name: animal },
    });
  }

  for (const age of animalAges) {
    await prisma.animalAge.upsert({
      where: { name: age },
      update: {},
      create: { name: age },
    });
  }

  for (const size of animalSizes) {
    await prisma.animalSize.upsert({
      where: { name: size },
      update: {},
      create: { name: size },
    });
  }

  /* ---------- seed brands & product lines ---------- */
  for (const [brandName, lines] of Object.entries(brandsWithLines)) {
    // 1) Crear / obtener la brand
    let brand = await prisma.brand.findFirst({ where: { name: brandName } });

    if (!brand) {
      brand = await prisma.brand.create({ data: { name: brandName } });
    }

    // 2) Crear cada product line si no existe
    for (const lineName of lines) {
      const exists = await prisma.productLine.findFirst({
        where: {
          name: lineName,
          brand_id: brand.id,
        },
      });

      if (!exists) {
        await prisma.productLine.create({
          data: {
            name: lineName,
            brand_id: brand.id,
          },
        });
      }
    }
  }

  console.log("✅ Seed completo: roles, animales, edades, tamaños, brands y líneas");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
