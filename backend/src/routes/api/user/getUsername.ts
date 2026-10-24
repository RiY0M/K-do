import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { makeIdParamsDto } from '../../../dtos/IdParamsDto';
import { UserService } from '../../../services/UserService';
import { UserServiceError } from '../../../errors/UserServiceError';

const ParamsDto = makeIdParamsDto('userId');

/**
 * Backs getUsername() in frontend/src/services/api/users.ts, used by the
 * friend page (FriendFullListSection.tsx) to show whose list it is.
 *
 * Returns `{ name }` rather than a bare string: Fastify sends strings as
 * plain text (not JSON), which the frontend's res.json() can't parse.
 *
 * NOTE: any authenticated user can look up any other user's username by id.
 * Usernames aren't especially sensitive (and are what you type to send a
 * friend request), but if that ever changes this endpoint would need a
 * friendship check.
 */
const getUsernameRoute: FastifyPluginAsync = async (fastify) => {
    const userService = new UserService(fastify.prisma);

    const schema: FastifySchema = {
        summary: "Get a user's display name by id",
        tags: ['users'],
        params: ParamsDto,
        response: {
            200: z.object({ name: z.string() }),
            404: z.object({ error: z.string() }),
        },
    };

    fastify.get<{ Params: { userId: string } }>(
        '/getUsername/:userId',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const { userId } = request.params;

            try {
                const username = await userService.getUsername(userId);
                reply.send({ name: username });
            } catch (err) {
                if (err instanceof UserServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default getUsernameRoute;
