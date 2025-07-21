FROM oven/bun:latest

WORKDIR /app

COPY ./package.json .

# COPY ./bun.lock .

RUN bun install

COPY . .

RUN bun run build

ENV NODE_ENV=production

EXPOSE 3006

CMD [ "bun","run","start" ]