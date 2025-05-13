// src/server.ts
import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { corsMiddleware } from './middleware/corsMiddleware';
import clientsRoutes from './routes/clientsRoutes';
import usersRoutes from './routes/usersRoutes';

import path from 'path';
import fastifyStatic from '@fastify/static';

const app = fastify();
const prisma = new PrismaClient();

// Registrar middleware de CORS
app.addHook('onRequest', corsMiddleware);

// Servir arquivos estáticos SOMENTE em ambiente de desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  app.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/', // Permite acessar /login/login.html diretamente
  });
  console.log('🧪 Ambiente de desenvolvimento: arquivos estáticos habilitados');
} else {
  console.log('🚀 Ambiente de produção: arquivos estáticos desativados');
}

// Registrar rotas de clientes e usuários
app.register(clientsRoutes);
app.register(usersRoutes);

// Iniciar o servidor
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen({ host: '0.0.0.0', port }).then(() => {
  console.log(`Http server running on http://localhost:${port}`);
});
