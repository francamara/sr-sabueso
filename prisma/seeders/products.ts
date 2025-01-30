import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function productsSeeder() {
  console.log("Seeding database with products...");

  // Seed Animals
  const dog = await prisma.animal.create({ data: { name: "Dog" } });
  const cat = await prisma.animal.create({ data: { name: "Cat" } });

  // Seed Lines
  const premium = await prisma.line.create({ data: { name: "Salmon Patagonico" } });
  const economy = await prisma.line.create({ data: { name: "Cordero" } });

  // Seed Brands
  const brand1 = await prisma.brand.create({ data: { name: "Old Prince" } });
  const brand2 = await prisma.brand.create({ data: { name: "Fawna" } });

  // Seed Factories
  const factory1 = await prisma.factory.create({ data: { name: "Baires" } });

  // Seed Distributors
  const distributor1 = await prisma.distributor.create({ data: { name: "Traverso" } });
  const distributor2 = await prisma.distributor.create({ data: { name: "Animal Brothers" } });

  // Seed Products
  const product1 = await prisma.product.create({
    data: {
      name: "Old Prince Cordero",
      description: "Old Prince Cordero Patagonico",
      weight: 15,
      listPrice: 40000,
      retailPrice: 60000,
      stock: 100,
      barcode: "1234567890",
      age: "Adult",
      size: "Large",
      animalId: dog.id,
      lineId: premium.id,
      brandId: brand1.id,
      factoryId: factory1.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Fawna Salmon Patagonico",
      description: "Fawna Salmon Patagonico",
      weight: 3,
      listPrice: 20,
      retailPrice: 25,
      stock: 50,
      barcode: "0987654321",
      age: "Puppy",
      size: "Small",
      animalId: cat.id,
      lineId: economy.id,
      brandId: brand2.id,
      factoryId: factory1.id,
    },
  });

  // Seed Product Distributors
  await prisma.productDistributor.createMany({
    data: [
      { productId: product1.id, distributorId: distributor1.id, stock: 50, price: 55 },
      { productId: product1.id, distributorId: distributor2.id, stock: 50, price: 57 },
      { productId: product2.id, distributorId: distributor1.id, stock: 25, price: 22 },
      { productId: product2.id, distributorId: distributor2.id, stock: 25, price: 23 },
    ],
  });

  console.log("Database seeding completed!");
}