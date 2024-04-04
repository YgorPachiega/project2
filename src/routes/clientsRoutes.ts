import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'; // Importe FastifyRequest e FastifyReply do fastify
import { getCadastro, cadastrarCliente, verificarID } from '../controllers/clientsController'; 
import { authMiddleware } from '../middleware/authMiddleware';

export default async function clientsRoutes(fastify: FastifyInstance) {
    fastify.get('/cadastro', getCadastro);
    fastify.post('/cadastrar', cadastrarCliente);
    fastify.get<{ Params: { id: string } }>('/verificar/:id', verificarID);
}
