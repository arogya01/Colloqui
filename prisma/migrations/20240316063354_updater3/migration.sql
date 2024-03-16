/*
  Warnings:

  - A unique constraint covering the columns `[userName]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `salt` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "salt" TEXT NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL,
ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "image" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userName_key" ON "Profile"("userName");
