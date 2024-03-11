/*
  Warnings:

  - Added the required column `restaurantId` to the `promotion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "promotion" ADD COLUMN     "restaurantId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "promotion" ADD CONSTRAINT "promotion_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
