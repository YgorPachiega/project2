// src/server.ts
import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { corsMiddleware } from './middleware/corsMiddleware';
import clientsRoutes from './routes/clientsRoutes';
import usersRoutes from './routes/usersRoutes';
import perfilRoutes from './routes/perfilRoutes';
import path from 'path';
import fastifyStatic from '@fastify/static';

const app = fastify();
const prisma = new PrismaClient();

// Middleware de CORS
app.addHook('onRequest', corsMiddleware);

// Arquivos estáticos (somente em desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
  app.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/',
  });
  console.log('🧪 Ambiente de desenvolvimento: arquivos estáticos habilitados');
} else {
  console.log('🚀 Ambiente de produção: arquivos estáticos desativados');
}

// Rotas principais (sem autenticação aqui — cada rota pode usar authMiddleware)
app.register(clientsRoutes, { prefix: '/api' });
app.register(usersRoutes, { prefix: '/api' });
app.register(perfilRoutes, { prefix: '/api' });

// Inicialização do servidor
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen({ host: '0.0.0.0', port }).then(() => {
  console.log(`✅ Http server running on http://localhost:${port}`);
});
