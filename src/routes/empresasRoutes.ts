import { FastifyInstance } from 'fastify';
import { getEmpresaByUserId, listarEmpresas } from '../controllers/empresasController';

export default async function empresasRoutes(fastify: FastifyInstance) {
  fastify.get('/empresas/by-user/:userId', getEmpresaByUserId);
  fastify.get('/empresas', listarEmpresas);
}
