import { generateProductCode } from '@/app/utils/utils'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function productsSeeder() {
  console.log('🌱 Seeding products and related data...')

  // Create brands
  await prisma.brand.createMany({
    data: [
      { name: 'Royal Canin' },
      { name: 'Purina Pro Plan' },
      { name: 'Old Prince' },
    ],
    skipDuplicates: true,
  })

  // Create animals
  await prisma.animal.createMany({
    data: [{ name: 'Dog' }, { name: 'Cat' }],
    skipDuplicates: true,
  })

  // Create distributors
  await prisma.distributor.createMany({
    data: [
      { name: 'Distributor A' },
      { name: 'Distributor B' },
      { name: 'Distributor C' },
    ],
    skipDuplicates: true,
  })

  // Fetch inserted brand and animal IDs
  const brandRoyalCanin = await prisma.brand.findFirst({
    where: { name: 'Royal Canin' },
  })
  const brandProPlan = await prisma.brand.findFirst({
    where: { name: 'Purina Pro Plan' },
  })
  const brandOldPrince = await prisma.brand.findFirst({
    where: { name: 'Old Prince' },
  })

  const animalDog = await prisma.animal.findFirst({ where: { name: 'Dog' } })
  const animalCat = await prisma.animal.findFirst({ where: { name: 'Cat' } })

  // Create products
  if(brandOldPrince && brandRoyalCanin && brandProPlan && animalCat && animalDog) {
    await prisma.product.createMany({
        data: [
          {
            name: "Royal Canin Medium Puppy",
            description: "Balanced food for medium breed puppies.",
            weight: 15,
            extraWeight: 0,
            stock: 50,
            sold: 10,
            retailPrice: 10000,
            brandId: brandRoyalCanin.id,
            animalId: animalDog.id,
            barcodeNumber: 123456789,
            uniqueCode: generateProductCode(),
          },
          {
            name: "Purina Pro Plan Adult Cat",
            description: "Nutritional food for adult cats.",
            weight: 7.5,
            extraWeight: 1,
            stock: 30,
            sold: 5,
            retailPrice: 8500,
            brandId: brandProPlan.id,
            animalId: animalCat.id,
            barcodeNumber: 1234512389,
            uniqueCode: generateProductCode(), 
          },
          {
            name: "Old Prince Cat Special",
            description: "Old Prince Cat Special.",
            weight: 5,
            extraWeight: 0.5,
            stock: 20,
            sold: 2,
            retailPrice: 7200,
            brandId: brandOldPrince.id,
            animalId: animalCat.id,
            barcodeNumber: 125456789,
            uniqueCode: generateProductCode(),  
          },
        ],
      });
      
      
  }

  // Fetch inserted product IDs
  const productRC = await prisma.product.findFirst({
    where: { name: 'Royal Canin Medium Puppy' },
  })
  const productPP = await prisma.product.findFirst({
    where: { name: 'Purina Pro Plan Adult Cat' },
  })
  const productOP = await prisma.product.findFirst({
    where: { name: 'Old Prince Rabbit Special' },
  })

  // Fetch distributor IDs
  const distributorA = await prisma.distributor.findFirst({
    where: { name: 'Distributor A' },
  })
  const distributorB = await prisma.distributor.findFirst({
    where: { name: 'Distributor B' },
  })
  const distributorC = await prisma.distributor.findFirst({
    where: { name: 'Distributor C' },
  })

  // Insert product-distributor relationships
  if (productRC && productOP && productPP && distributorA && distributorB && distributorC) {
    await prisma.productDistributor.createMany({
      data: [
        {
          productId: productRC.id!,
          distributorId: distributorA.id!,
          stock: 20,
          price: 9500,
        },
        {
          productId: productPP.id!,
          distributorId: distributorB.id!,
          stock: 15,
          price: 8000,
        },
        {
          productId: productOP.id!,
          distributorId: distributorC.id!,
          stock: 10,
          price: 7000,
        },
      ],
    })
  }

  console.log('✅ Products and related data seeded successfully!')
}
