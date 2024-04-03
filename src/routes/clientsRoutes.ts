import { FastifyInstance } from 'fastify';
import { getCadastro, cadastrarCliente } from '../controllers/clientsController';
import { authMiddleware } from '../middleware/authMiddleware';

export default async function clientsRoutes(fastify: FastifyInstance) {
    fastify.get('/cadastro', { preHandler: authMiddleware }, getCadastro);
    fastify.post('/cadastrar', { preHandler: authMiddleware }, cadastrarCliente);

}
