import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fastifyStatic from '@fastify/static';
import cors from '@fastify/cors';

// Rotas
import participantesRoutes from './routes/participantesRoutes';
import perfilRoutes from './routes/perfilRoutes';
import usersRoutes from './routes/usersRoutes';
import empresasRoutes from './routes/empresasRoutes';
import checkinRoutes from './routes/checkinRoutes';
import eventosRoutes from './routes/eventosRoutes';

const app = fastify();
const prisma = new PrismaClient();

// Configura CORS oficial
app.register(cors, {
  origin: 'https://project2-dbfp.onrender.com', // Você pode colocar seu domínio aqui, ex.: 'https://project2-dbfp.onrender.com'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

// Servir arquivos estáticos em desenvolvimento
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
app.register(participantesRoutes, { prefix: '/api' });
app.register(perfilRoutes, { prefix: '/api' });
app.register(checkinRoutes, { prefix: '/api' });
app.register(usersRoutes, { prefix: '/api' });
app.register(empresasRoutes, { prefix: '/api' });
app.register(eventosRoutes, { prefix: '/api' });

// Start
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen({ host: '0.0.0.0', port }).then(() => {
  console.log(`✅ Http server running on http://localhost:${port}`);
});