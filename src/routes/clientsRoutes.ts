import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'; // Importe FastifyRequest e FastifyReply do fastify
import { getCadastro, cadastrarCliente} from '../controllers/clientsController'; 
import { authMiddleware } from '../middleware/authMiddleware';

export default async function clientsRoutes(fastify: FastifyInstance) {
    fastify.get('/cadastro', { preHandler: authMiddleware }, getCadastro);
    fastify.post('/cadastrar', { preHandler: authMiddleware }, cadastrarCliente);
}
