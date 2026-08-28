#FROM node:22-alpine
FROM node:22-slim

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package*.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

EXPOSE 5173

#CMD ["pnpm", "run", "dev", "--", "--host"]
CMD ["npx", "vite", "--host", "0.0.0.0"]