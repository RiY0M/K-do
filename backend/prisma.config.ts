import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// Prisma 7 CLI configuration (migrate, generate...). The CLI no longer reads
// .env by itself, hence dotenv. In Docker, DATABASE_URL comes from compose.
export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: env('DATABASE_URL'),
    },
});
