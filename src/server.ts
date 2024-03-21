import { PrismaClient } from '@prisma/client';
import fastify from 'fastify';
import { z } from 'zod';
import { parse } from 'json2csv';

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
    const cadastro = await prisma.clients.findMany();
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

app.get('/verificar', async (request, reply) => {
    const { id }  = request.query;

    if (typeof id === 'string' || id instanceof String) { // Verifica se id é uma string ou um objeto String
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

app.get('/gerar-csv', async (request, reply) => {
    const cadastros = await prisma.clients.findMany();
    const csv = parse(cadastros);
    
    reply
        .header('Content-Type', 'text/csv')
        .header('Content-Disposition', 'attachment; filename=cadastros.csv')
        .send(csv);
});

app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
    console.log('Http server running');
});
