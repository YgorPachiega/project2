import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Definir perfil (Cadastro)
export const definirPerfil = async (request: FastifyRequest, reply: FastifyReply) => {
  const {
    email,
    auth0Id,
    nome,
    tipoUsuario,
    empresaRelacionada,
    empresa,
  } = request.body as {
    email: string;
    auth0Id: string;
    nome: string;
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

  if (!email || !auth0Id || !tipoUsuario || !nome) {
    return reply.status(400).send({ error: 'Dados obrigatórios não fornecidos.' });
  }

  try {
    const perfilExistente = await prisma.users.findUnique({
      where: { email },
    });

    if (perfilExistente) {
      return reply.status(400).send({ error: 'Perfil já definido para este e-mail.' });
    }

    let perfilCriado;

    if (tipoUsuario === 'prestador') {
      if (!empresaRelacionada) {
        return reply.status(400).send({ error: 'Empresa vinculada é obrigatória para prestadores.' });
      }

      const empresaBuscada = await prisma.empresas.findFirst({
        where: { nome: empresaRelacionada },
      });

      if (!empresaBuscada) {
        return reply.status(404).send({ error: 'Empresa não encontrada.' });
      }

      perfilCriado = await prisma.users.create({
        data: {
          email,
          auth0Id,
          nome,
          tipoUsuario: 'prestador',
          empresaRelacionada,
          empresaId: empresaBuscada.id,
          aprovado: false, // Aguarda aprovação
        },
      });

    } else if (tipoUsuario === 'empresa') {
      if (!empresa || !empresa.nome || !empresa.cnpj) {
        return reply.status(400).send({ error: 'Nome e CNPJ da empresa são obrigatórios.' });
      }

      // Cria o usuário
      const usuarioEmpresa = await prisma.users.create({
        data: {
          email,
          auth0Id,
          nome,
          tipoUsuario: 'empresa',
          aprovado: true,
        },
      });

      // Cria a empresa vinculada
      const empresaCriada = await prisma.empresas.create({
        data: {
          nome: empresa.nome,
          cnpj: empresa.cnpj,
          endereco: empresa.endereco || null,
          setor: empresa.setor || null,
          telefone: empresa.telefone || null,
          userId: usuarioEmpresa.id,
        },
      });

      // Atualiza o user com o empresaId
      perfilCriado = await prisma.users.update({
        where: { id: usuarioEmpresa.id },
        data: {
          empresaId: empresaCriada.id,
        },
      });

    } else {
      return reply.status(400).send({ error: 'Tipo de usuário inválido.' });
    }

    return reply.status(201).send({ message: 'Perfil criado com sucesso.', perfil: perfilCriado });

  } catch (error) {
    console.error('Erro ao definir perfil:', error);
    return reply.status(500).send({ error: 'Erro interno ao definir perfil.' });
  }
};

// Verificar perfil (utilizado no login)
export const verificarPerfil = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email } = request.query as { email: string };

  if (!email) {
    return reply.status(400).send({ error: 'Email é obrigatório.' });
  }

  try {
    const perfil = await prisma.users.findUnique({
      where: { email },
    });

    if (!perfil) {
      return reply.status(404).send({ error: 'Perfil não encontrado.' });
    }

    return reply.status(200).send(perfil);
  } catch (error) {
    console.error('Erro ao verificar perfil:', error);
    return reply.status(500).send({ error: 'Erro interno ao verificar perfil.' });
  }
};
