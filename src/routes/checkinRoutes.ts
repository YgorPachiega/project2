import { FastifyInstance } from "fastify";
import {
    registrarEntrada,
    registrarSaida,
    listarCheckins
} from '../controllers/checkinController';

export default async function checkinRoutes(fastify: FastifyInstance) {
    fastify.post('/checkin/entrada', registrarEntrada);
    fastify.post('/checkin/saida', registrarSaida);
    fastify.get('/checkin/historico', listarCheckins);
}