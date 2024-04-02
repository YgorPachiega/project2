// src/routes/clientsRoutes.ts
import { FastifyInstance } from 'fastify';
import { getCadastro, cadastrarCliente } from '../controllers/clientsController';

export default async function clientsRoutes(fastify: FastifyInstance) {
    fastify.get('/cadastro', getCadastro);
    fastify.post('/cadastrar', cadastrarCliente);
    // Outras rotas relacionadas a clientes, se necessário
}
