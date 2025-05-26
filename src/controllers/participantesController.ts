import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Listar todos os participantes
export const listarParticipantes = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const participantes = await prisma.participantes.findMany({
      orderBy: { nome: 'asc' },
    });
    return reply.status(200).send(participantes);
  } catch (error) {
    console.error('Erro ao listar participantes:', error);
    return reply.status(500).send({ error: 'Erro ao listar participantes.' });
  }
};

// Cadastrar um novo participante
export const cadastrarParticipante = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id, nome, cpf, empresa, solicitanteId } = request.body as {
    id: string;
    nome: string;
    cpf: string;
    empresa: string;
    solicitanteId: string;
  };

  if (!id || !nome || !cpf || !empresa || !solicitanteId) {
    return reply.status(400).send({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const participante = await prisma.participantes.create({
      data: { id, nome, cpf, empresa, solicitanteId },
    });

    return reply.status(201).send({ message: 'Participante cadastrado com sucesso.', participante });
  } catch (error: any) {
    console.error('Erro ao cadastrar participante:', error);
    return reply.status(400).send({ error: 'Erro ao cadastrar participante.' });
  }
};

// Verificar se um ID de participante está disponível
export const verificarDisponibilidadeId = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.query as { id?: string };

  if (!id) {
    return reply.status(400).send({ error: 'ID é obrigatório.' });
  }

  try {
    const participante = await prisma.participantes.findUnique({ where: { id } });

    if (participante) {
      return reply.status(200).send({ message: 'ID já utilizado.', participante });
    }

    return reply.status(200).send({ message: 'ID disponível.' });
  } catch (error) {
    console.error('Erro ao verificar ID:', error);
    return reply.status(500).send({ error: 'Erro ao verificar ID.' });
  }
};

// Buscar participante por ID
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

// Atualizar dados de um participante
export const atualizarParticipante = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const { nome, cpf, empresa } = request.body as {
    nome?: string;
    cpf?: string;
    empresa?: string;
  };

  if (!id) {
    return reply.status(400).send({ error: 'ID é obrigatório.' });
  }

  try {
    const participante = await prisma.participantes.update({
      where: { id },
      data: { nome, cpf, empresa },
    });

    return reply.status(200).send({ message: 'Participante atualizado com sucesso.', participante });
  } catch (error) {
    console.error('Erro ao atualizar participante:', error);
    return reply.status(500).send({ error: 'Erro ao atualizar participante.' });
  }
};

// Deletar um participante
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