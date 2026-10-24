FROM node:22-alpine
WORKDIR /app

# Prisma's engines need OpenSSL, which alpine doesn't ship by default
RUN apk add --no-cache openssl

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npx prisma generate

EXPOSE 3000

# Applies pending migrations (and regenerates the client in case the schema
# changed since the image was built) before starting
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && npm run dev"]
