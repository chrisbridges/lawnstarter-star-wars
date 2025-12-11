# ---- FRONTEND BUILD ----
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# ---- SERVER ----
FROM node:20-alpine
WORKDIR /app

# Install server deps
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --omit=dev

# Copy server source
COPY server/src ./src

# Copy built client into /client-build for Express static serving
COPY --from=client-build /app/client/dist ./client-build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "src/index.js"]