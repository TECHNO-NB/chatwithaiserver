FROM node:latest AS builder

WORKDIR /app

COPY package.json .
COPY . .
RUN  npm install 

RUN npm build


FROM node:latest AS production

WORKDIR /dist

COPY --from=builder /dist .
COPY package.json .
RUN npm install


CMD [ "npm","start" ]