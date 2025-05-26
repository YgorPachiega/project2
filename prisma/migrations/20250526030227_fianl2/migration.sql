-- CreateTable
CREATE TABLE "Empresas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "endereco" TEXT,
    "setor" TEXT,
    "telefone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "auth0Id" TEXT NOT NULL,
    "tipoUsuario" TEXT NOT NULL,
    "aprovado" BOOLEAN NOT NULL DEFAULT false,
    "empresaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Eventos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "local" TEXT,
    "empresaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participantes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "solicitanteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checkin" (
    "id" TEXT NOT NULL,
    "entrada" TIMESTAMP(3) NOT NULL,
    "saida" TIMESTAMP(3),
    "participanteId" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "observacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Checkin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresas_cnpj_key" ON "Empresas"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_auth0Id_key" ON "Users"("auth0Id");

-- CreateIndex
CREATE UNIQUE INDEX "Participantes_cpf_key" ON "Participantes"("cpf");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eventos" ADD CONSTRAINT "Eventos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participantes" ADD CONSTRAINT "Participantes_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "Participantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
