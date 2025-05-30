/*
  Warnings:

  - Added the required column `eventoId` to the `Participantes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Participantes" ADD COLUMN     "eventoId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Participantes" ADD CONSTRAINT "Participantes_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
