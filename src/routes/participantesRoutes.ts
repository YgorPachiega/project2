import { FastifyInstance } from 'fastify';
import {
  listarParticipantesPorEvento,
  cadastrarParticipante,
  buscarParticipantePorId,
  deletarParticipante,
  importarParticipantesEmLote,

} from '../controllers/participantesController';

export default async function clientsRoutes(fastify: FastifyInstance) {
  fastify.post('/participantes', cadastrarParticipante);
  fastify.get('/participantes/by-evento/:eventoId', listarParticipantesPorEvento);
  fastify.get('/participantes/:id', buscarParticipantePorId);
  fastify.delete('/participantes/id:', deletarParticipante);
  fastify.post('/participantes/importar-lote', importarParticipantesEmLote)

}
