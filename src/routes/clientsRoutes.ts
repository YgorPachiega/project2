import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'; // Importe FastifyRequest e FastifyReply do fastify
import { getCadastro, cadastrarCliente, verificarCliente, verificarFuncionario, registrarObservacao} from '../controllers/clientsController'; 
import { authMiddleware } from '../middleware/authMiddleware';

export default async function clientsRoutes(fastify: FastifyInstance) {
    fastify.get('/cadastro', getCadastro);
    fastify.get('/verificar', verificarCliente);
    fastify.post('/cadastrar', cadastrarCliente);
    fastify.get('/verificarFunc', verificarFuncionario);
    fastify.post('/alterarFunc', registrarObservacao);

 }

