import { FastifyInstance } from 'fastify';
import { cadastrarUsuario, fazerLogin } from '../controllers/usersController';

export default async function usersRoutes(fastify: FastifyInstance) {
    fastify.post('/cadastro_login', cadastrarUsuario);
    fastify.post('/login', fazerLogin);
}