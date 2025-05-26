// src/middleware/corsMiddleware.ts
import { FastifyRequest, FastifyReply } from 'fastify';

export const corsMiddleware = (request: FastifyRequest, reply: FastifyReply, done: () => void) => {
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  reply.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  if (request.method === 'OPTIONS') {
    reply.status(204).send(); // ✅ status correto para preflight
  } else {
    done();
  }
};
