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

export const verificarCliente = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.query as { id?: string };
  
    if (!id) {
      return reply
        .status(400)
        .type('application/json')
        .send({ message: 'ID inválido' });
    }
  
    try {
      const cliente = await prisma.clients.findUnique({ where: { id } });
  
      if (cliente) {
        return reply
          .status(200)
          .type('application/json')
          .send({ message: 'ID já utilizado' });
      }
  
      return reply
        .status(200)
        .type('application/json')
        .send({ message: 'ID disponível' });
    } catch (error: any) {
      console.error('Erro ao verificar cliente:', error);
      return reply
        .status(500)
        .type('application/json')
        .send({ message: 'Erro ao verificar cliente' });
    }
  };
  

export const verificarFuncionario = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.query as { id: string };

    if (typeof id === 'string') {
        try {
            const existingClient = await prisma.clients.findUnique({
                where: { id: String(id) },
            });

            if (existingClient) {
                reply.status(200).send(existingClient); // Retorna os detalhes do funcionário encontrado
            } else {
                reply.status(404).send({ error: 'Funcionário não encontrado' });
            }
        } catch (error: any) {
            console.error('Erro ao verificar o funcionário:', error);
            reply.status(500).send({ error: 'Erro ao verificar o funcionário' });
        }
    } else {
        reply.status(400).send({ error: 'ID inválido' });
    }
};

export const registrarObservacao = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.query as { id: string };
    const { observacao, updatedAt } = request.body as { observacao: string, updatedAt: string };

    try {
        // Verificar se o funcionário existe
        const funcionario = await prisma.clients.findUnique({
            where: { id: String(id) }
        });

        if (!funcionario) {
            reply.status(404).send({ error: 'Funcionário não encontrado' });
            return;
        }

        // Atualizar a observação e a data de atualização do funcionário no banco de dados
        await prisma.clients.update({
            where: { id: String(id) },
            data: {
                observacao,
                updatedAt: new Date(updatedAt)
            }
        });

        // Responder com uma mensagem de sucesso
        reply.status(200).send({ message: 'Observação registrada com sucesso!' });
    } catch (error: any) {
        console.error('Erro ao registrar observação:', error);
        reply.status(500).send({ error: 'Erro ao registrar observação' });
    }
};

// Outros métodos relacionados a clientes, se necessário
