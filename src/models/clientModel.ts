import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Client {
    id: string;
    nome: string;
    cpf: string;
    empresa: string;
    solicitante: string;
}

export const clientModel = {
    async findAll(): Promise<Client[]> {
        return prisma.clients.findMany();
    },

    async findById(id: string): Promise<Client | null> {
        return prisma.clients.findUnique({ where: { id } });
    },

    async create(id: string, clientData: Omit<Client, 'id'> & { solicitante: string }): Promise<Client> {
        return prisma.clients.create({ data: { ...clientData, id } });
    },
    // Outros métodos aqui...
};
