import { FastifyInstance } from 'fastify';
import {
  getCadastro,
  cadastrarCliente,
  verificarCliente,
  verificarFuncionario,
  registrarObservacao
} from '../controllers/clientsController';

export default async function clientsRoutes(fastify: FastifyInstance) {
  fastify.get('/cadastro', getCadastro);
  fastify.get('/verificar', verificarCliente);
  fastify.post('/cadastrar', cadastrarCliente);
  fastify.get('/verificarFunc', verificarFuncionario);
  fastify.post('/alterarFunc', registrarObservacao);
}
