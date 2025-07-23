FROM node:latest

WORKDIR /app

COPY ./package.json .

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3006

CMD [ "npm","run","start" ]