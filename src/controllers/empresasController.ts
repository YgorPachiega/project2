import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getEmpresaByUserId = async (request: FastifyRequest, reply: FastifyReply) => {
  const { userId } = request.params as { userId: string };

  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: { empresa: true},
    });

    if (!user || !user.empresa) {
      return reply.status(404).send({ error: 'Empresa não encontrada para este usuário.' });
    }

    return reply.status(200).send(user.empresa);
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    return reply.status(500).send({ error: 'Erro interno ao buscar empresa.' });
  }
};

export const listarEmpresas = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const empresas = await prisma.empresas.findMany({
      select: { id: true, nome: true },
      orderBy: { nome: 'asc' }
    });

    return reply.status(200).send(empresas);
  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    return reply.status(500).send({ error: 'Erro interno ao listar empresas.' });
  }
};
