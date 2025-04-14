/*
  Warnings:

  - You are about to drop the column `product_line_id` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_product_line_id_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "product_line_id",
ADD COLUMN     "productLineId" INTEGER;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productLineId_fkey" FOREIGN KEY ("productLineId") REFERENCES "ProductLine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
