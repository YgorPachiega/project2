import { PrismaClient } from '@prisma/client';
import fastify from 'fastify';
import { z } from 'zod';

const prisma = new PrismaClient();
const app = fastify();

app.addHook('onRequest', (request, reply, done) => {
    if(request.method === 'OPTIONS'){
    reply.header('Access-Control-Allow-Credentials', 'true');
    reply.header('Access-Control-Allow-Origin', '*'); // Permite que qualquer origem acesse a API
    reply.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'); // Define os cabeçalhos permitidos
    reply.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT'); // Define os métodos HTTP permitidos
    reply.status(200).send();
    
}else{

    done();
}
});


app.get('/cadastro', async () => {
    const cadastro = await prisma.clients.findMany()

    return{cadastro}

})

app.post('/cadastrar', async (request, reply) => {
    const createClientSchema = z.object({
        id: z.string(),
        nome: z.string(),
        cpf: z.string(),
        empresa: z.string()
    });

    try {
        const { id, nome, cpf, empresa } = createClientSchema.parse(request.body);

        await prisma.clients.create({
            data: {
                id,
                nome,
                cpf,
                empresa
            }
        });

        reply.status(201).send({ message: 'Dados cadastrados com sucesso' });
    } catch (error: any) {
        // Aqui utilizei ': any' para definir o tipo do erro explicitamente.
        reply.status(400).send({ error: error.errors });
    }
});

app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
    console.log('Http server running');
});
