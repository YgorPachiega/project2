import { FastifyInstance } from 'fastify';
import { listarPrestadoresPendentes, aprovarPrestador } from '../controllers/aprovacaoController';

export default async function aprovacaoRoutes(fastify: FastifyInstance) {
  fastify.get('/prestadores/pendentes', listarPrestadoresPendentes);
  fastify.put('/prestadores/aprovar/:id', aprovarPrestador);
}