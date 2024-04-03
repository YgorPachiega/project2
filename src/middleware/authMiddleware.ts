// authMiddleware.ts

import { FastifyRequest, FastifyReply } from 'fastify';
import { verificarToken } from '../utils/jwtUtils'; // Importe a função verificarToken
import { JwtPayload } from 'jsonwebtoken'; // Importe o tipo JwtPayload

// Declaração de tipos para adicionar a propriedade 'usuario' ao objeto de solicitação
interface AuthenticatedRequest extends FastifyRequest {
    usuario?: string;
}

export const authMiddleware = async (request: AuthenticatedRequest, reply: FastifyReply, done: () => void) => {
    const token = request.headers['authorization'];

    if (!token) {
        // Se o token não for fornecido, redirecione o usuário para a página de login
        return reply.redirect('/login');
    }

    try {
        // Use a função verificarToken para validar o token
        const decodedToken = verificarToken(token);

        // Verifique se a variável 'decodedToken' é do tipo 'JwtPayload' antes de acessar a propriedade 'usuario'
        if (typeof decodedToken === 'object' && 'usuario' in decodedToken) {
            request.usuario = (decodedToken as JwtPayload).usuario; // Acessa a propriedade 'usuario' do tipo JwtPayload
            done(); // Continue com a execução da rota
        } else {
            // Se 'decodedToken' não for do tipo 'JwtPayload', redirecione o usuário para a página de login
            return reply.redirect('/login');
        }
    } catch (error) {
        // Se ocorrer um erro ao validar o token, redirecione o usuário para a página de login
        return reply.redirect('/login');
    }
};
