import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Listar prestadores pendentes para uma empresa
export const listarPrestadoresPendentes = async (request: FastifyRequest, reply: FastifyReply) => {
  const { empresaNome } = request.query as { empresaNome: string };

  if (!empresaNome) {
    return reply.status(400).send({ error: 'Nome da empresa é obrigatório.' });
  }

  try {
    const prestadores = await prisma.users.findMany({
      where: {
        tipoUsuario: 'prestador',
        empresaRelacionada: empresaNome,
        aprovado: false,
      },
    });

    return reply.status(200).send(prestadores);
  } catch (error) {
    console.error('Erro ao listar prestadores pendentes:', error);
    return reply.status(500).send({ error: 'Erro interno ao listar prestadores.' });
  }
};

// Aprovar um prestador
export const aprovarPrestador = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  try {
    const prestador = await prisma.users.findUnique({
      where: { id: parseInt(id) },
    });

    if (!prestador || prestador.tipoUsuario !== 'prestador') {
      return reply.status(404).send({ error: 'Prestador não encontrado.' });
    }

    const updatedPrestador = await prisma.users.update({
      where: { id: parseInt(id) },
      data: { aprovado: true },
    });

    return reply.status(200).send({ message: 'Prestador aprovado com sucesso.', prestador: updatedPrestador });
  } catch (error) {
    console.error('Erro ao aprovar prestador:', error);
    return reply.status(500).send({ error: 'Erro interno ao aprovar prestador.' });
  }
};