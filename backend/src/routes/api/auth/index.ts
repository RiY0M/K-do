import type { FastifyPluginAsync } from 'fastify';
import loginRoute from './login';
import registerRoute from './register';
import forgotPasswordRoute from './forgotPassword';
import resetPasswordRoute from './resetPassword';
import revertAccountChangeRoute from './revertAccountChange';

const authRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(loginRoute);
    await fastify.register(registerRoute);
    await fastify.register(forgotPasswordRoute);
    await fastify.register(resetPasswordRoute);
    await fastify.register(revertAccountChangeRoute);
};

export default authRoutes;
