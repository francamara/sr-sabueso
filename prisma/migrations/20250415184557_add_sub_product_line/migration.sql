-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "subProductLineId" INTEGER;

-- CreateTable
CREATE TABLE "SubProductLine" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "productLineId" INTEGER NOT NULL,

    CONSTRAINT "SubProductLine_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubProductLine" ADD CONSTRAINT "SubProductLine_productLineId_fkey" FOREIGN KEY ("productLineId") REFERENCES "ProductLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subProductLineId_fkey" FOREIGN KEY ("subProductLineId") REFERENCES "SubProductLine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
