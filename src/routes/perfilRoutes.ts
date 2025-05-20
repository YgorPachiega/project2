// src/routes/perfilRoutes.ts
import { FastifyInstance } from 'fastify';
import { definirPerfil } from '../controllers/perfilController';
import { verificarPerfil } from '../controllers/perfilController';

export default async function perfilRoutes(fastify: FastifyInstance) {
  fastify.post('/definir_perfil', definirPerfil);
  fastify.get('/verificar-perfil', verificarPerfil);

}