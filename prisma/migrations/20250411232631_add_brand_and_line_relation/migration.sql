/*
  Warnings:

  - Added the required column `brand_id` to the `ProductLine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductLine" ADD COLUMN     "brand_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductLine" ADD CONSTRAINT "ProductLine_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
