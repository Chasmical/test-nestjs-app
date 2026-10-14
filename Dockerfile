FROM node:26-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

ENV NODE_ENV production
CMD ["sh", "-c", "npm run prisma:deploy && node ./dist/main.js"]
