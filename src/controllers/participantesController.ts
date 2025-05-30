import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Listar participantes por evento
export const listarParticipantesPorEvento = async (request: FastifyRequest, reply: FastifyReply) => {
  const { eventoId } = request.params as { eventoId: string };

  if (!eventoId) {
    return reply.status(400).send({ error: 'EventoId é obrigatório.' });
  }

  try {
    const participantes = await prisma.participantes.findMany({
      where: { eventoId },
      orderBy: { nome: 'asc' },
    });

    return reply.status(200).send(participantes);
  } catch (error) {
    console.error('Erro ao listar participantes:', error);
    return reply.status(500).send({ error: 'Erro ao listar participantes.' });
  }
};

// Cadastrar novo participante vinculado ao evento
export const cadastrarParticipante = async (request: FastifyRequest, reply: FastifyReply) => {
  const { nome, cpf, empresa, eventoId, solicitanteId } = request.body as {
    nome: string;
    cpf: string;
    empresa: string;
    eventoId: string;
    solicitanteId: string;
  };

  if (!nome || !cpf || !empresa || !eventoId || !solicitanteId) {
    return reply.status(400).send({ error: 'Campos obrigatórios não preenchidos.' });
  }

  try {
    const participante = await prisma.participantes.create({
      data: { nome, cpf, empresa, eventoId, solicitanteId },
    });

    return reply.status(201).send({ message: 'Participante cadastrado com sucesso.', participante });
  } catch (error) {
    console.error('Erro ao cadastrar participante:', error);
    return reply.status(400).send({ error: 'Erro ao cadastrar participante.' });
  }
};

// Buscar participante por ID (opcional, para manutenção)
export const buscarParticipantePorId = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  if (!id) {
    return reply.status(400).send({ error: 'ID é obrigatório.' });
  }

  try {
    const participante = await prisma.participantes.findUnique({ where: { id } });

    if (!participante) {
      return reply.status(404).send({ error: 'Participante não encontrado.' });
    }

    return reply.status(200).send(participante);
  } catch (error) {
    console.error('Erro ao buscar participante:', error);
    return reply.status(500).send({ error: 'Erro ao buscar participante.' });
  }
};

// Deletar participante (manutenção futura)
export const deletarParticipante = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  if (!id) {
    return reply.status(400).send({ error: 'ID é obrigatório.' });
  }

  try {
    await prisma.participantes.delete({ where: { id } });
    return reply.status(200).send({ message: 'Participante deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar participante:', error);
    return reply.status(500).send({ error: 'Erro ao deletar participante.' });
  }
};