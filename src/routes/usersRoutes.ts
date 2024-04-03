import { FastifyInstance } from 'fastify';
import { cadastrarUsuario, fazerLogin, puxar } from '../controllers/usersController';

export default async function usersRoutes(fastify: FastifyInstance) {
    fastify.post('/cadastro_login', cadastrarUsuario);
    fastify.post('/login', fazerLogin);
    fastify.post('/puxar', puxar);
}