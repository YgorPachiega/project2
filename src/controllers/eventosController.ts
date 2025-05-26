import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Criar um evento
export const criarEvento = async (request: FastifyRequest, reply: FastifyReply) => {
  const { nome, descricao, dataInicio, dataFim, local, empresaId, prestadoresIds } = request.body as {
    nome: string;
    descricao?: string;
    dataInicio: string;
    dataFim: string;
    local?: string;
    empresaId: string;
    prestadoresIds: string[];
  };

  if (!nome || !dataInicio || !dataFim || !empresaId) {
    return reply.status(400).send({ error: 'Campos obrigatórios não preenchidos.' });
  }

  try {
    const evento = await prisma.eventos.create({
      data: {
        nome,
        descricao,
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim),
        local,
        empresaId,
        prestadores: {
          create: prestadoresIds.map((id) => ({
            prestadorId: id,
          })),
        },
      },
    });

    return reply.status(201).send({ message: 'Evento criado com sucesso.', evento });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return reply.status(500).send({ error: 'Erro interno ao criar evento.' });
  }
};

// Listar eventos por empresa
export const listarEventosPorEmpresa = async (request: FastifyRequest, reply: FastifyReply) => {
  const { empresaId } = request.query as { empresaId: string };

  if (!empresaId) {
    return reply.status(400).send({ error: 'ID da empresa é obrigatório.' });
  }

  try {
    const eventos = await prisma.eventos.findMany({
      where: { empresaId },
      include: {
        prestadores: {
          include: { prestador: true },
        },
      },
      orderBy: { dataInicio: 'asc' },
    });

    return reply.status(200).send(eventos);
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    return reply.status(500).send({ error: 'Erro interno ao listar eventos.' });
  }
};

// Listar eventos por prestador
export const listarEventosPorPrestador = async (request: FastifyRequest, reply: FastifyReply) => {
  const { prestadorId } = request.query as { prestadorId: string };

  if (!prestadorId) {
    return reply.status(400).send({ error: 'ID do prestador é obrigatório.' });
  }

  try {
    const eventos = await prisma.eventoPrestadores.findMany({
      where: { prestadorId },
      include: {
        evento: true,
      },
    });

    return reply.status(200).send(eventos);
  } catch (error) {
    console.error('Erro ao listar eventos do prestador:', error);
    return reply.status(500).send({ error: 'Erro interno ao listar eventos do prestador.' });
  }
};

// Deletar evento
export const deletarEvento = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  if (!id) {
    return reply.status(400).send({ error: 'ID do evento é obrigatório.' });
  }

  try {
    await prisma.eventos.delete({
      where: { id },
    });

    return reply.status(200).send({ message: 'Evento deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    return reply.status(500).send({ error: 'Erro interno ao deletar evento.' });
  }
};

// Atualizar dados de um evento
export const atualizarEvento = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const {
    nome,
    descricao,
    dataInicio,
    dataFim,
    local,
    prestadoresIds,
  } = request.body as {
    nome?: string;
    descricao?: string;
    dataInicio?: string;
    dataFim?: string;
    local?: string;
    prestadoresIds?: string[]; // Lista de IDs de prestadores vinculados
  };

  try {
    const eventoExistente = await prisma.eventos.findUnique({
      where: { id },
    });

    if (!eventoExistente) {
      return reply.status(404).send({ error: 'Evento não encontrado.' });
    }

    // Atualiza os dados principais do evento
    const eventoAtualizado = await prisma.eventos.update({
      where: { id },
      data: {
        nome,
        descricao,
        dataInicio: dataInicio ? new Date(dataInicio) : undefined,
        dataFim: dataFim ? new Date(dataFim) : undefined,
        local,
      },
    });

    // Atualiza os prestadores vinculados, se enviados
    if (prestadoresIds && prestadoresIds.length > 0) {
      // Remove todos os vínculos atuais
      await prisma.eventoPrestadores.deleteMany({
        where: { eventoId: id },
      });

      // Cria novos vínculos
      const vinculacoes = prestadoresIds.map((prestadorId) => ({
        eventoId: id,
        prestadorId: prestadorId,
      }));

      await prisma.eventoPrestadores.createMany({
        data: vinculacoes,
      });
    }

    return reply.status(200).send({ message: 'Evento atualizado com sucesso.', evento: eventoAtualizado });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return reply.status(500).send({ error: 'Erro interno ao atualizar evento.' });
  }
};