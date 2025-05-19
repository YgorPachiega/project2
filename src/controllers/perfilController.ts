import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const definirPerfil = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, auth0Id, tipoUsuario, empresaRelacionada, empresa } = request.body as {
    email: string;
    auth0Id: string;
    tipoUsuario: 'empresa' | 'prestador';
    empresaRelacionada?: string;
    empresa?: {
      nome: string;
      cnpj: string;
      endereco?: string;
      setor?: string;
      telefone?: string;
    };
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

    let perfil;
    if (tipoUsuario === 'prestador') {
      if (!empresaRelacionada) {
        return reply.status(400).send({ error: 'Empresa relacionada é obrigatória para prestadores.' });
      }

      perfil = await prisma.users.create({
        data: {
          email,
          auth0Id,
          tipoUsuario,
          empresaRelacionada,
          aprovado: false,
        },
      });
    } else if (tipoUsuario === 'empresa') {
      if (!empresa || !empresa.nome || !empresa.cnpj) {
        return reply.status(400).send({ error: 'Nome e CNPJ da empresa são obrigatórios.' });
      }

      perfil = await prisma.users.create({
        data: {
          email,
          auth0Id,
          tipoUsuario,
          aprovado: true,
          empresa: {
            create: {
              // Removido userId: undefined
              nome: empresa.nome,
              cnpj: empresa.cnpj,
              endereco: empresa.endereco || null,
              setor: empresa.setor || null,
              telefone: empresa.telefone || null,
            },
          },
        },
      });
    }

    return reply.status(201).send({ message: 'Perfil definido com sucesso.', perfil });
  } catch (error) {
    console.error('Erro ao definir perfil:', error);
    return reply.status(500).send({ error: 'Erro interno ao salvar perfil.' });
  }
};