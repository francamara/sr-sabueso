import { PrismaClient } from "@prisma/client";
import { productsSeeder } from "./seeders/products";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  await productsSeeder();

  console.log("✅ Database seeding completed!");
}

main()
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
