// src/controllers/perfilController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const definirPerfil = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, auth0Id, tipoUsuario, empresaRelacionada } = request.body as {
    email: string;
    auth0Id: string;
    tipoUsuario: 'empresa' | 'prestador';
    empresaRelacionada?: string;
  };

  if (!email || !auth0Id || !tipoUsuario) {
    return reply.status(400).send({ error: 'Dados obrigatórios não fornecidos.' });
  }

  try {
    const perfilExistente = await prisma.users.findUnique({
      where: { email },
    });

    if (perfilExistente) {
      return reply.status(400).send({ error: 'Perfil já definido para este e-mail.' });
    }

    const perfil = await prisma.users.create({
      data: {
        email,
        auth0Id,
        tipoUsuario,
        empresaRelacionada: tipoUsuario === 'prestador' ? empresaRelacionada : null,
        aprovado: tipoUsuario === 'empresa', // empresas são aprovadas automaticamente
      },
    });

    return reply.status(201).send({ message: 'Perfil definido com sucesso.', perfil });
  } catch (error) {
    console.error('Erro ao definir perfil:', error);
    return reply.status(500).send({ error: 'Erro interno ao salvar perfil.' });
  }
};
