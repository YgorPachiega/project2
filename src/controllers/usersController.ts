import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Buscar usuário por e-mail
export const getUserByEmail = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email } = request.params as { email: string };

  try {
    const user = await prisma.users.findUnique({
      where: { email },
      include: {
        empresa: true, // Inclui os dados da empresa vinculada
      },
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

// Listar prestadores pendentes de aprovação para uma empresa
export const listarPrestadoresPendentes = async (request: FastifyRequest, reply: FastifyReply) => {
  const { empresaId } = request.query as { empresaId: string };

  if (!empresaId) {
    return reply.status(400).send({ error: 'O nome da empresa é obrigatório.' });
  }

  try {
    const prestadores = await prisma.users.findMany({
      where: {
        tipoUsuario: 'prestador',
        empresaId: empresaId,
        aprovado: false,
      },
      select: {
        id: true,
        email: true,
        nome: true, // Pode incluir outros campos que desejar exibir
      },
    });

    return reply.status(200).send(prestadores);
  } catch (error) {
    console.error('Erro ao listar prestadores pendentes:', error);
    return reply.status(500).send({ error: 'Erro interno ao listar prestadores pendentes.' });
  }
};

// Aprovar um prestador
export const aprovarPrestador = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  try {
    const prestador = await prisma.users.findUnique({
      where: { id },
    });

    if (!prestador || prestador.tipoUsuario !== 'prestador') {
      return reply.status(404).send({ error: 'Prestador não encontrado.' });
    }

    const updatedPrestador = await prisma.users.update({
      where: { id },
      data: { aprovado: true },
    });

    return reply.status(200).send({
      message: 'Prestador aprovado com sucesso.',
      prestador: updatedPrestador,
    });
  } catch (error) {
    console.error('Erro ao aprovar prestador:', error);
    return reply.status(500).send({ error: 'Erro interno ao aprovar prestador.' });
  }
};
