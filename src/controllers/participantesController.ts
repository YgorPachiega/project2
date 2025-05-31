import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ Listar participantes por evento
export const listarParticipantesPorEvento = async (request: FastifyRequest, reply: FastifyReply) => {
  const { eventoId } = request.params as { eventoId: string };

  if (!eventoId) {
    return reply.status(400).send({ error: 'EventoId é obrigatório.' });
  }

  try {
    const participantes = await prisma.participantes.findMany({
      where: { eventoId: eventoId },
      orderBy: { nome: 'asc' },
    });
    return reply.status(200).send(participantes);
  } catch (error) {
    console.error('Erro ao listar participantes:', error);
    return reply.status(500).send({ error: 'Erro ao listar participantes.' });
  }
};

// ✅ Buscar participante por ID (mantido para futuras funcionalidades como leitura de QR Code)
export const buscarParticipantePorId = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  if (!id) {
    return reply.status(400).send({ error: 'ID é obrigatório.' });
  }

  try {
    const participante = await prisma.participantes.findUnique({
      where: { id },
    });

    if (!participante) {
      return reply.status(404).send({ error: 'Participante não encontrado.' });
    }

    return reply.status(200).send(participante);
  } catch (error) {
    console.error('Erro ao buscar participante:', error);
    return reply.status(500).send({ error: 'Erro ao buscar participante.' });
  }
};

// ✅ Cadastro individual de participante
export const cadastrarParticipante = async (request: FastifyRequest, reply: FastifyReply) => {
  const { nome, cpf, empresa, solicitanteId, eventoId } = request.body as {
    nome: string;
    cpf: string;
    empresa: string;
    solicitanteId: string;
    eventoId: string;
  };

  if (!nome || !cpf || !empresa || !solicitanteId || !eventoId) {
    return reply.status(400).send({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const participante = await prisma.participantes.create({
      data: { nome, cpf, empresa, solicitanteId, eventoId },
    });

    return reply.status(201).send({ message: 'Participante cadastrado com sucesso.', participante });
  } catch (error: any) {
    console.error('Erro ao cadastrar participante:', error);
    return reply.status(400).send({ error: 'Erro ao cadastrar participante.' });
  }
};

// ✅ Deletar participante
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

// ✅ Importação em lote de participantes
export const importarParticipantesEmLote = async (request: FastifyRequest, reply: FastifyReply) => {
  const { participantes } = request.body as { participantes: {
    nome: string;
    cpf: string;
    empresa: string;
    solicitanteId: string;
    eventoId: string;
  }[] };

  if (!participantes || !participantes.length) {
    return reply.status(400).send({ error: 'Nenhum participante enviado.' });
  }

  try {
    await prisma.participantes.createMany({
      data: participantes,
      skipDuplicates: true // Evita CPFs duplicados
    });

    return reply.status(201).send({ message: 'Importação concluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao importar participantes:', error);
    return reply.status(500).send({ error: 'Erro ao importar participantes.' });
  }
};