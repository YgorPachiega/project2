import { FastifyInstance } from "fastify";
import cors from '@fastify/cors';

export async function corsMiddleware(app: FastifyInstance) {
  await app.register(cors, {
    origin: ['https://project2-dbfp.onrender.com'],
    credentials: true,
  })
}