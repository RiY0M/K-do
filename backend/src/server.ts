import 'dotenv/config';
import Fastify from 'fastify';
import app from './app';
import { checkEnvironment } from './config';
import {
    serializerCompiler,
    validatorCompiler,
} from 'fastify-type-provider-zod';

// trustProxy: in production the server sits behind Caddy and nginx, so the
// client's IP and protocol come from the X-Forwarded-* headers
const server = Fastify({ logger: true, trustProxy: true });

try {
    checkEnvironment(server.log);
} catch (err) {
    console.error((err as Error).message);
    process.exit(1);
}

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

await server.register(app);

const port = Number(process.env.PORT ?? 3000);

try {
    await server.listen({ port, host: '0.0.0.0' });
} catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
}
