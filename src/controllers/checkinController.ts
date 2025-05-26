import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Registrar um check-in (entrada)
export const registrarEntrada = async (request: FastifyRequest, reply: FastifyReply) => {
  const { participanteId, eventoId } = request.body as { participanteId: string; eventoId: string };

  if (!participanteId || !eventoId) {
    return reply.status(400).send({ error: 'Participante e Evento são obrigatórios.' });
  }

  try {
    const checkin = await prisma.checkin.create({
     data: {
        participanteId,
        eventoId,
        entrada: new Date(),
    },
    });

    return reply.status(201).send({ message: 'Entrada registrada com sucesso.', checkin });
  } catch (error) {
    console.error('Erro ao registrar entrada:', error);
    return reply.status(500).send({ error: 'Erro interno ao registrar entrada.' });
  }
};

// Registrar um check-out (saída)
export const registrarSaida = async (request: FastifyRequest, reply: FastifyReply) => {
  const { participanteId, eventoId } = request.body as { participanteId: string; eventoId: string };

  if (!participanteId || !eventoId) {
    return reply.status(400).send({ error: 'Participante e Evento são obrigatórios.' });
  }

  try {
    const ultimoCheckin = await prisma.checkin.findFirst({
      where: {
        participanteId,
        eventoId,
        saida: null,
      },
      orderBy: {
        entrada: 'desc',
      },
    });

    if (!ultimoCheckin) {
      return reply.status(404).send({ error: 'Nenhum check-in encontrado para realizar o check-out.' });
    }

    const checkout = await prisma.checkin.update({
      where: { id: ultimoCheckin.id },
      data: { saida: new Date() },
    });

    return reply.status(200).send({ message: 'Saída registrada com sucesso.', checkout });
  } catch (error) {
    console.error('Erro ao registrar saída:', error);
    return reply.status(500).send({ error: 'Erro interno ao registrar saída.' });
  }
};

// Listar histórico de check-ins de um participante em um evento
export const listarCheckins = async (request: FastifyRequest, reply: FastifyReply) => {
  const { participanteId, eventoId } = request.query as { participanteId: string; eventoId: string };

  if (!participanteId || !eventoId) {
    return reply.status(400).send({ error: 'Participante e Evento são obrigatórios.' });
  }

  try {
    const checkins = await prisma.checkin.findMany({
      where: {
        participanteId,
        eventoId,
      },
      orderBy: {
        entrada: 'asc',
      },
   });

    return reply.status(200).send(checkins);
  } catch (error) {
    console.error('Erro ao listar check-ins:', error);
    return reply.status(500).send({ error: 'Erro interno ao listar check-ins.' });
  }
};