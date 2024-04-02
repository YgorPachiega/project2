// src/models/userModel.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface User {
    id: string;
    usuario: string;
    senha: string;
}

export const userModel = {
    async findByUsername(username: string): Promise<User | null> {
        const result = await prisma.users.findUnique({ where: { usuario: username } });
        if (result === null) {
            return null;
        }
        // Convertendo o id para string
        const user: User = { ...result, id: result.id.toString() };
        return user;
    },

    async create(userData: Omit<User, 'id'>): Promise<User> {
        const result = await prisma.users.create({ data: userData });
        // Convertendo o id para string
        const user: User = { ...result, id: result.id.toString() };
        return user;
    },

    // Adicione outros métodos conforme necessário
};
