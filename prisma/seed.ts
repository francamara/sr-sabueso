import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = ["admin"];
  const animals = ["perro", "gato"];
  const animalAges = ["cachorro", "adulto", "senior"];
  const animalSizes = ["pequeño", "mediano", "grande"];

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

  console.log("✅ Roles, animals, ages, and sizes seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
