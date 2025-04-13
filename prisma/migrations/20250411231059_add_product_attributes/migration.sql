/*
  Warnings:

  - Added the required column `animal_age_id` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_line_id` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "animal_age_id" INTEGER NOT NULL,
ADD COLUMN     "animal_size_id" INTEGER,
ADD COLUMN     "product_line_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ProductLine" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProductLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimalAge" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AnimalAge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimalSize" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AnimalSize_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_product_line_id_fkey" FOREIGN KEY ("product_line_id") REFERENCES "ProductLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_animal_age_id_fkey" FOREIGN KEY ("animal_age_id") REFERENCES "AnimalAge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_animal_size_id_fkey" FOREIGN KEY ("animal_size_id") REFERENCES "AnimalSize"("id") ON DELETE SET NULL ON UPDATE CASCADE;
