/*
  Warnings:

  - You are about to drop the `Clients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Clients";

-- DropTable
DROP TABLE "public"."Users";

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "usuario" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clients" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "solicitante" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_usuario_key" ON "Users"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Clients_id_key" ON "Clients"("id");
