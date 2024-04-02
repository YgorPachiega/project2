// src/server.ts
import fastify from 'fastify';
import { corsMiddleware } from './middleware/corsMiddleware';;
import clientsRoutes from './routes/clientsRoutes';
import usersRoutes from './routes/usersRoutes';

const app = fastify();

// Registrar middleware de CORS
app.addHook('onRequest', corsMiddleware);

// Registrar rotas de clientes
app.register(clientsRoutes);

// Registrar rotas de usuários
app.register(usersRoutes);

app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
    console.log('Http server running');
});
