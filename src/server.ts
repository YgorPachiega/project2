import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { corsMiddleware } from './middleware/corsMiddleware';
import clientsRoutes from './routes/participantesRoutes';
import perfilRoutes from './routes/perfilRoutes';
import aprovacaoRoutes from './routes/aprovacaoRoutes';
import usersRoutes from './routes/usersRoutes';
import empresasRoutes from './routes/empresasRoutes';
import path from 'path';
import fastifyStatic from '@fastify/static';

const app = fastify();
const prisma = new PrismaClient();

app.addHook('onRequest', corsMiddleware);

if (process.env.NODE_ENV !== 'production') {
  app.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/',
  });
  console.log('🧪 Ambiente de desenvolvimento: arquivos estáticos habilitados');
} else {
  console.log('🚀 Ambiente de produção: arquivos estáticos desativados');
}

app.register(clientsRoutes, { prefix: '/api' });
app.register(perfilRoutes, { prefix: '/api' });
app.register(aprovacaoRoutes, { prefix: '/api' });
app.register(usersRoutes, { prefix: '/api' });
app.register(empresasRoutes, { prefix: '/api' });

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen({ host: '0.0.0.0', port }).then(() => {
  console.log(`✅ Http server running on http://localhost:${port}`);
});