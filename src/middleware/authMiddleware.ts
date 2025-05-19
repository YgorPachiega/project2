import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: 'https://dev-agq6qfbtj4yee13n.us.auth0.com/.well-known/jwks.json',
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  if (!header.kid) return callback(new Error('No kid found in token header'));

  client.getSigningKey(header.kid, function (err, key) {
    if (err) return callback(err);
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Token ausente ou malformado' });
  }

  const token = authHeader.split(' ')[1];

  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        audience: 'https://qreader.api', // Se você criou a API no Auth0
        issuer: 'https://dev-agq6qfbtj4yee13n.us.auth0.com/',
        algorithms: ['RS256']
      },
      (err, decoded) => {
        if (err) {
          return reply.status(401).send({ error: 'Token inválido' });
        }

        // Você pode armazenar os dados do usuário no request
        (request as any).user = decoded;
        resolve(true);
      }
    );
  });
}
