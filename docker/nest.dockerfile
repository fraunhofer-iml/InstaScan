FROM node:lts-alpine AS builder
ARG APP
WORKDIR /app
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./
RUN npm install
COPY . .
RUN npm run build:${APP}

FROM node:lts-alpine AS production
ARG APP
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist/apps/${APP} .
COPY ./blockchain/abi ./blockchain/abi

CMD ["node", "main.js"]
