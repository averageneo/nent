FROM node:12-alpine as builder

RUN mkdir -p /home/app
WORKDIR /home/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# --- ----

FROM node:12-alpine

WORKDIR /home/app

COPY --from=builder /home/app/package*.json /home/app/
COPY --from=builder /home/app/dist/ /home/app/dist/

RUN npm ci --production
EXPOSE 3000

CMD ["node", "dist/main.js"]