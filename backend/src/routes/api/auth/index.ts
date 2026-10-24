import type { FastifyPluginAsync } from 'fastify';
import loginRoute from './login';
import registerRoute from './register';
import forgotPasswordRoute from './forgotPassword';
import resetPasswordRoute from './resetPassword';

const authRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(loginRoute);
    await fastify.register(registerRoute);
    await fastify.register(forgotPasswordRoute);
    await fastify.register(resetPasswordRoute);
};

export default authRoutes;
