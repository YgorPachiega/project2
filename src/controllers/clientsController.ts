// src/controllers/clientsController.ts
import { PrismaClient } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify';

const prisma = new PrismaClient();

interface Client {
    id: string;
    nome: string;
    cpf: string;
    empresa: string;
    solicitante: string;
}

export const getCadastro = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const cadastro: Client[] = await prisma.clients.findMany();
        reply.send({ cadastro });
    } catch (error: any) {
        reply.status(500).send({ error: 'Erro ao buscar o cadastro de clientes' });
    }
};



export const cadastrarCliente = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id, nome, cpf, empresa, solicitante }: Client = request.body as Client;
    try {
        await prisma.clients.create({
            data: { id, nome, cpf, empresa, solicitante }
        });
        reply.status(201).send({ message: 'Dados cadastrados com sucesso' });
    } catch (error: any) {
        reply.status(400).send({ error: 'Erro ao cadastrar cliente' });
    }
};

// Outros métodos relacionados a clientes, se necessário
