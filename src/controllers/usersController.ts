import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserByEmail = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email } = request.params as { email: string };

  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return reply.status(404).send({ error: 'Usuário não encontrado.' });
    }

    return reply.status(200).send(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return reply.status(500).send({ error: 'Erro interno ao buscar usuário.' });
  }
};