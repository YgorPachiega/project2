import { PrismaClient } from "@prisma/client"
import fastify from "fastify"
import { z } from 'zod'

const app = fastify()

const prisma = new PrismaClient()

app.post ('/Clients', async (request, reply) => {
    const createClientSchema = z.object ({
        name: z.string(),
        email: z.string().email(),
    })

    const {name, email} = createClientSchema.parse(request.body)

    await prisma.clients.create({
        data: {
            name,
            email,
        }
    })

    return reply.status(201).send()
})

app.listen({
    host:'0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
    console.log('Http server running')
})