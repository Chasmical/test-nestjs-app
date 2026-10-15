FROM node:26-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
RUN npm i -g tsx
COPY . .
RUN npm run build

ENV NODE_ENV production
CMD ["sh", "-c", "npm run prisma:deploy && npm run prisma:seed && node ./dist/main.js"]
