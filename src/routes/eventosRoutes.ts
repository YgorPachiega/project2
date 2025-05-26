import { FastifyInstance } from "fastify";
import {
    criarEvento,
    deletarEvento,
    listarEventosPorEmpresa,
    listarEventosPorPrestador,
} from '../controllers/eventosController';

export default async function eventosRoutes(fastify: FastifyInstance) {
 fastify.post('/eventos', criarEvento);
 fastify.get('/eventos/empresa', listarEventosPorEmpresa);
 fastify.get('/eventos/prestador', listarEventosPorPrestador);
 fastify.delete('/eventos/:id', deletarEvento);
}