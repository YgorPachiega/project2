-- CreateTable
CREATE TABLE "EventoPrestadores" (
    "id" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "prestadorId" TEXT NOT NULL,

    CONSTRAINT "EventoPrestadores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventoPrestadores_eventoId_prestadorId_key" ON "EventoPrestadores"("eventoId", "prestadorId");

-- AddForeignKey
ALTER TABLE "EventoPrestadores" ADD CONSTRAINT "EventoPrestadores_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoPrestadores" ADD CONSTRAINT "EventoPrestadores_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
