/*
  Warnings:

  - The primary key for the `Clients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `Clients` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Clients` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Clients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `Clients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresa` to the `Clients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Clients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Clients" DROP CONSTRAINT "Clients_pkey",
DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "empresa" TEXT NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Clients_id_key" ON "Clients"("id");
