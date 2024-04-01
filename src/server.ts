import { PrismaClient } from '@prisma/client';
import fastify from 'fastify';
import { z } from 'zod';
import { parse } from 'json2csv';
const bcrypt = require('bcryptjs');


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

app.get('/exportar-csv', async (request, reply) => {
    try {
        const clients = await prisma.clients.findMany();
        const csv = parse(clients, { fields: ['id', 'nome', 'cpf', 'empresa'] });

        reply.header('Content-Disposition', 'attachment; filename="clientes.csv"');
        reply.header('Content-Type', 'text/csv');
        return csv;
    } catch (error: any) {
        reply.status(500).send({ error: 'Erro ao exportar os dados como CSV' });
    }
});

app.post('/cadastrar', async (request, reply) => {
    const createClientSchema = z.object({
        id: z.string(),
        nome: z.string(),
        cpf: z.string(),
        empresa: z.string(),
        solicitante: z.string()
    });

    try {
        const { id, nome, cpf, empresa, solicitante } = createClientSchema.parse(request.body);
        await prisma.clients.create({
            data: { id, nome, cpf, empresa, solicitante }
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


const createUserSchema = z.object({
    usuario: z.string(),
    senha: z.string(),
});

app.get('/cadastro_login', async () => {
    const cadastro = await prisma.users.findMany();
    return { cadastro };
});

app.post('/cadastro_login', async (request, reply) => {
    try {
        const { usuario, senha } = createUserSchema.parse(request.body);

        // Verifica se o usuário já existe no banco de dados
        const existingUser = await prisma.users.findUnique({
            where: {
                usuario: usuario,
            },
        });

        if (existingUser) {
            return reply.status(400).send({ error: 'Usuário já existe' });
        }

        // Criptografa a senha antes de armazená-la no banco de dados
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Cria o usuário no banco de dados
        await prisma.users.create({
            data: {
                usuario: usuario,
                senha: hashedPassword,
            },
        });

        reply.status(201).send({ message: 'Usuário cadastrado com sucesso' });
    } catch (error: any) {
        reply.status(400).send({ error: error.message });
    }
});

app.post('/login', async (request: any, reply: any) => {
    try {
        const { usuario, senha }: { usuario: string; senha: string; } = request.body;

        // Verifica se o usuário existe no banco de dados
        const user = await prisma.users.findUnique({
            where: {
                usuario: usuario,
            },
        });

        if (!user) {
            return reply.status(404).send({ error: 'Usuário não encontrado' });
        }

        // Compara a senha fornecida com a senha armazenada no banco de dados
        const passwordMatch = await bcrypt.compare(senha, user.senha);
        if (!passwordMatch) {
            return reply.status(401).send({ error: 'Senha incorreta' });
        }

        // Se as credenciais estiverem corretas, gera um token de autenticação (você pode usar JWT, por exemplo)
        // Aqui você pode adicionar lógica para gerar e retornar um token de autenticação

        // Por enquanto, vamos enviar uma mensagem de login bem-sucedido
        return reply.status(200).send({ message: 'Login bem-sucedido' });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        reply.status(500).send({ error: 'Erro ao fazer login' });
    }
});


app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
    console.log('Http server running');
});
