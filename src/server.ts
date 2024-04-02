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

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;
app.listen(PORT, (err) => {
    if (err) {
        console.error('Erro ao iniciar o servidor:', err);
        process.exit(1);
    }
    console.log(`Servidor rodando na porta ${PORT}`);
});
