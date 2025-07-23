FROM node:latest

WORKDIR /app

COPY ./package.json .

COPY ./.bunfig.toml .

RUN npm install bun -g

RUN bun install

COPY . .

RUN bun run build

ENV NODE_ENV=production

EXPOSE 3006

CMD [ "bun","run","start" ]