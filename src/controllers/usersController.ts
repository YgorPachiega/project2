import { PrismaClient } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify';
const bcrypt = require('bcryptjs');
import { gerarToken, verificarToken } from '../utils/jwtUtils';

const prisma = new PrismaClient();

interface User {
    usuario: string;
    senha: string;
}

export const cadastrarUsuario = async (request: FastifyRequest, reply: FastifyReply) => {
    const { usuario, senha } = request.body as User;
    try {
        const existingUser = await prisma.users.findUnique({
            where: {
                usuario: usuario,
            },
        });
        if (existingUser) {
            return reply.status(400).send({ error: 'Usuário já existe' });
        }
        const hashedPassword = await bcrypt.hash(senha, 8);
        await prisma.users.create({
            data: {
                usuario: usuario,
                senha: hashedPassword,
            },
        });
        reply.status(201).send({ message: 'Usuário cadastrado com sucesso' });
    } catch (error: any) {
        reply.status(400).send({ error: 'Erro ao cadastrar usuário' });
    }
};

export const fazerLogin = async (request: FastifyRequest, reply: FastifyReply) => {
    const { usuario, senha } = request.body as User;
    try {
        const user = await prisma.users.findUnique({
            where: {
                usuario: usuario,
            },
        });
        if (!user) {
            return reply.status(404).send({ error: 'Usuário não encontrado' });
        }
        const passwordMatch = await bcrypt.compare(senha, user.senha);
        if (!passwordMatch) {
            return reply.status(401).send({ error: 'Senha incorreta' });
        }
        
        const token = gerarToken(usuario);
        return reply.status(200).send({ message: 'Login bem-sucedido', token });
    } catch (error:any) {
        console.error('Erro ao fazer login:', error);
        reply.status(500).send({ error: 'Erro ao fazer login' });
    }
};

export const puxar = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const dados = await prisma.users.findMany(); // Ajuste aqui para 'user' caso a tabela se chame 'Users'

        reply.status(200).send({ dados });
    } catch (error) {
        console.error('Erro ao obter todos os dados:', error);
        reply.status(500).send({ error: 'Erro ao obter todos os dados' });
    }
};