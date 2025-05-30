import { FastifyInstance } from 'fastify';
import {
  listarParticipantesPorEvento,
  cadastrarParticipante,
  buscarParticipantePorId,
  deletarParticipante,

} from '../controllers/participantesController';

export default async function clientsRoutes(fastify: FastifyInstance) {
  fastify.get('/participantes', listarParticipantesPorEvento);
  fastify.post('/participantes/cadastrar', cadastrarParticipante);
  fastify.get('/participantes/:id', buscarParticipantePorId);
  fastify.delete('/participantes/id:', deletarParticipante);

}
