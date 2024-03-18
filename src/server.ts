import { PrismaClient } from '@prisma/client';
import fastify from 'fastify';
import { z } from 'zod';

const prisma = new PrismaClient();
const app = fastify();

// Middleware para lidar com as opções de CORS
app.addHook('onRequest', (request, reply, done) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    reply.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (request.method === 'OPTIONS') {
        reply.send('');
    } else {
        done();
    }
});

app.get('/cadastro', async () => {
    const cadastro = await prisma.clients.findMany()
    return { cadastro };
});

app.post('/cadastrar', async (request, reply) => {
    const createClientSchema = z.object({
        id: z.string(),
        nome: z.string(),
        cpf: z.string(),
        empresa: z.string()
    });

    try {
        const { id, nome, cpf, empresa } = createClientSchema.parse(request.body);
        await prisma.clients.create({
            data: { id, nome, cpf, empresa }
        });
        reply.status(201).send({ message: 'Dados cadastrados com sucesso' });
    } catch (error: any) {
        reply.status(400).send({ error: error.errors });
    }
});

app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
    console.log('Http server running');
});
