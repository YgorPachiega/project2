import { FastifyInstance } from 'fastify';
import {
  getUserByEmail,
  listarPrestadoresPendentes,
  aprovarPrestador
} from '../controllers/usersController';

export default async function usersRoutes(fastify: FastifyInstance) {
  fastify.get('/users/:email', getUserByEmail);
  fastify.get('/prestadores/pendentes', listarPrestadoresPendentes);
  fastify.put('/prestadores/aprovar/:id', aprovarPrestador);
}
