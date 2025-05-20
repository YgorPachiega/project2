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

  console.log('Dados recebidos:', { email, auth0Id, tipoUsuario, empresaRelacionada, empresa });

  if (!email || !auth0Id || !tipoUsuario) {
    console.log('Erro: Dados obrigatórios não fornecidos.');
    return reply.status(400).send({ error: 'Dados obrigatórios não fornecidos.' });
  }

  try {
    console.log('Verificando perfil existente para email:', email);
    const perfilExistente = await prisma.users.findUnique({
      where: { email },
    });

    if (perfilExistente) {
      console.log('Erro: Perfil já definido para este e-mail:', email);
      return reply.status(400).send({ error: 'Perfil já definido para este e-mail.' });
    }

    let perfil;
    if (tipoUsuario === 'prestador') {
      if (!empresaRelacionada) {
        console.log('Erro: Empresa relacionada é obrigatória para prestadores.');
        return reply.status(400).send({ error: 'Empresa relacionada é obrigatória para prestadores.' });
      }

      console.log('Criando prestador com empresaRelacionada:', empresaRelacionada);
      perfil = await prisma.users.create({
        data: {
          email,
          auth0Id,
          tipoUsuario,
          empresaRelacionada,
          aprovado: false,
        },
      });
      console.log('Prestador criado com sucesso:', perfil);
    } else if (tipoUsuario === 'empresa') {
      if (!empresa || !empresa.nome || !empresa.cnpj) {
        console.log('Erro: Nome e CNPJ da empresa são obrigatórios.');
        return reply.status(400).send({ error: 'Nome e CNPJ da empresa são obrigatórios.' });
      }

      console.log('Criando empresa com dados:', empresa);
      perfil = await prisma.users.create({
        data: {
          email,
          auth0Id,
          tipoUsuario,
          aprovado: true,
          empresa: {
            create: {
              nome: empresa.nome,
              cnpj: empresa.cnpj,
              endereco: empresa.endereco || null,
              setor: empresa.setor || null,
              telefone: empresa.telefone || null,
            },
          },
        },
      });
      console.log('Empresa criada com sucesso:', perfil);
    } else {
      console.log('Erro: Tipo de usuário inválido:', tipoUsuario);
      return reply.status(400).send({ error: 'Tipo de usuário inválido.' });
    }

    return reply.status(201).send({ message: 'Perfil definido com sucesso.', perfil });
  } catch (error) {
    console.error('Erro ao definir perfil:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return reply.status(500).send({ error: 'Erro interno ao salvar perfil.', details: errorMessage });
  }
};

export const verificarPerfil = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email } = request.query as { email: string };

  if (!email) {
    return reply.status(400).send({ error: 'Email não fornecido.' });
  }

  try {
    const perfil = await prisma.users.findUnique({ where: { email } });

    if (!perfil) {
      return reply.status(404).send({ error: 'Perfil não encontrado.' });
    }

    return reply.status(200).send({ message: 'Perfil já cadastrado.' });
  } catch (error) {
    console.error('Erro ao verificar perfil:', error);
    return reply.status(500).send({ error: 'Erro ao verificar perfil.' });
  }
};