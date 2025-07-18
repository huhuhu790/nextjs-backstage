FROM oven/bun:latest

WORKDIR /app

COPY ./package.json .

COPY ./bun.lock .

RUN bun install

COPY . .

RUN bun run build

EXPOSE 3006

CMD [ "bun","run","start" ]