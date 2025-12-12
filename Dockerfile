# ─────────────────────────────────────────────
# Stage 1: build frontend + install backend deps
# ─────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copy the whole repo (simplest)
COPY . .

# Build the React app
WORKDIR /app/client
RUN npm install && npm run build

# Install server dependencies
WORKDIR /app/server
RUN npm install --omit=dev


# ─────────────────────────────────────────────
# Stage 2: runtime image
# ─────────────────────────────────────────────
FROM node:20-alpine

# All runtime code lives under /app/server
WORKDIR /app/server

# Copy server code + node_modules from build stage
COPY --from=build /app/server ./

# Copy built frontend into /app/server/public
# (we'll serve this via Express)
COPY --from=build /app/client/build ./public

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "src/index.cjs"]