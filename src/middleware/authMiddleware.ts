import { FastifyRequest, FastifyReply } from 'fastify';
import { verificarToken } from '../utils/jwtUtils';
import { JwtPayload } from 'jsonwebtoken';

interface AuthenticatedRequest extends FastifyRequest {
    usuario?: string;
}

export const authMiddleware = async (request: AuthenticatedRequest, reply: FastifyReply, done: () => void) => {
    const token = request.headers['authorization'];

    if (!token) {
        return reply.status(401).send({ error: 'Token não fornecido' });
    }

    try {
        const decodedToken = verificarToken(token);
        if (typeof decodedToken === 'object' && 'usuario' in decodedToken) {
            request.usuario = (decodedToken as JwtPayload).usuario;
        } else {
            throw new Error('Token inválido');
        }

        done();
    } catch (error) {
        return reply.status(401).send({ error: 'Token inválido' });
    }
};