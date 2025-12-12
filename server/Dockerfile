FROM node:20-alpine

WORKDIR /app

# Copy only server files (build context will be ./server)
COPY package*.json ./
COPY src ./src

RUN npm install --production

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "src/index.cjs"]
