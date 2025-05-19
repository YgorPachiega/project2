// src/server.ts
import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { corsMiddleware } from './middleware/corsMiddleware';
import clientsRoutes from './routes/clientsRoutes';
import usersRoutes from './routes/usersRoutes';

import path from 'path';
import fastifyStatic from '@fastify/static';
import jwt from '@fastify/jwt';
const { fastifyJwtSecret } = require('jwks-rsa'); // ✅ Compatível com CommonJS

const app = fastify();
const prisma = new PrismaClient();

// Middleware de CORS
app.addHook('onRequest', corsMiddleware);

// 🔐 Auth0 JWT validation via JWKS
app.register(jwt, {
  secret: fastifyJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-agq6qfbtj4yee13n.us.auth0.com/.well-known/jwks.json',
  }),
  sign: { algorithm: 'RS256' }
});

// 🔐 Middleware de proteção de rotas
app.decorate('authenticate', async function (request: any, reply: any) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Token inválido ou ausente' });
  }
});

// Arquivos estáticos em dev
if (process.env.NODE_ENV !== 'production') {
  app.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/',
  });
  console.log('🧪 Ambiente de desenvolvimento: arquivos estáticos habilitados');
} else {
  console.log('🚀 Ambiente de produção: arquivos estáticos desativados');
}

// Rotas
app.register(clientsRoutes, { prefix: '/api' });
app.register(usersRoutes, { prefix: '/api' }); // pode remover se estiver desativando login/cadastro manual

// Start
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen({ host: '0.0.0.0', port }).then(() => {
  console.log(`✅ Http server running on http://localhost:${port}`);
});
