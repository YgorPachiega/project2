// src/server.ts
import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { corsMiddleware } from './middleware/corsMiddleware';;
import clientsRoutes from './routes/clientsRoutes';
import usersRoutes from './routes/usersRoutes';

const app = fastify();
const prisma = new PrismaClient();

app.get('/verificar', async (request, reply) => {
    const { id } = request.query as {id:string};

    if (typeof id === 'string') {
        // Agora 'id' está assegurado como uma string
        const existingClient = await prisma.clients.findUnique({
            where: { id: String(id) }, // Garante que o id seja uma string
        });

        if (existingClient) {
            reply.status(400).send({ error: 'ID já utilizado' });
        } else {
            reply.status(200).send({ message: 'ID disponível' });
        }
    } else {
        reply.status(400).send({ error: 'ID inválido' });
    }
});



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


