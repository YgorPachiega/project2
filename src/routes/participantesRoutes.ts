import { FastifyInstance } from 'fastify';
import {
  listarParticipantes,
  cadastrarParticipante,
  buscarParticipantePorId,
  deletarParticipante,
  atualizarParticipante,
  verificarDisponibilidadeId,
} from '../controllers/participantesController';

export default async function clientsRoutes(fastify: FastifyInstance) {
  fastify.get('/participantes', listarParticipantes);
  fastify.post('/participantes/cadastrar', cadastrarParticipante);
  fastify.get('/participantes/verificar', verificarDisponibilidadeId);
  fastify.get('/participantes/:id', buscarParticipantePorId);
  fastify.put('/participantes/:id', atualizarParticipante);
  fastify.delete('/participantes/id:', deletarParticipante);

}
