FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package.json .

RUN npm install --production

CMD [ "npm", "run", "start:prod" ]

EXPOSE 3000-4000