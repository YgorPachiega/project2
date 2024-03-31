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


interface Users {
    id: number;
    usuario: string;
    senha: string;}

// Rota para o login de usuários
app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;

    // Procura o usuário no "banco de dados"
    Users.findOne<Users>({
        where: {
            usuario: usuario
        }
    }).then((user) => {
        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }

        // Compara a senha criptografada
        bcrypt.compare(senha, user.senha, (err, result) => {
            if (result) {
                res.status(200).send('Login bem-sucedido');
            } else {
                res.status(401).send('Senha incorreta');
            }
        });
    }).catch(err => {
        console.error('Erro ao procurar usuário:', err);
        res.status(500).send('Erro ao procurar usuário');
    });
});





app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
    console.log('Http server running');
});
