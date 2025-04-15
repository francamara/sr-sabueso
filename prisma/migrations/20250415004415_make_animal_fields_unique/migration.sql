/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Animal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `AnimalAge` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `AnimalSize` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Animal_name_key" ON "Animal"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AnimalAge_name_key" ON "AnimalAge"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AnimalSize_name_key" ON "AnimalSize"("name");
