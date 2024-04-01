-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Clients";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Users";

-- CreateTable
CREATE TABLE "Users"."Users" (
    "id" SERIAL NOT NULL,
    "usuario" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clients"."Clients" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_usuario_key" ON "Users"."Users"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Clients_id_key" ON "Clients"."Clients"("id");
