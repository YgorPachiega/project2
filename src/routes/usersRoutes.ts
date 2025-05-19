import { FastifyInstance } from 'fastify';
import { getUserByEmail } from '../controllers/usersController';

export default async function usersRoutes(fastify: FastifyInstance) {
  fastify.get('/users/:email', getUserByEmail);
}