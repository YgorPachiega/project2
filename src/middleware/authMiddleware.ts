// No arquivo authMiddleware.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { verificarToken } from '../utils/jwtUtils';
import { JwtPayload } from 'jsonwebtoken';
import { clientModel, Client } from '../models/clientModel';

interface AuthenticatedRequest extends FastifyRequest {
    usuario?: string;
}

export const authMiddleware = async (request: AuthenticatedRequest, reply: FastifyReply, done: () => void) => {
    const token = request.headers['authorization'];

    if (!token) {
        return reply.redirect('/login');
    }

    try {
        const decodedToken = verificarToken(token);

        if (typeof decodedToken === 'object' && 'usuario' in decodedToken) {
            request.usuario = (decodedToken as JwtPayload).usuario;
            done();
        } else {
            return reply.redirect('/login');
        }
    } catch (error) {
        return reply.redirect('/login');
    }
};

