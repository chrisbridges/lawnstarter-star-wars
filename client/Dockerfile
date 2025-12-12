FROM node:20-alpine as build

WORKDIR /app

# Copy client sources (build context will be ./client)
COPY package*.json ./
COPY vite.config.js ./
COPY index.html ./
COPY src ./src

RUN npm ci && npm run build

FROM nginx:stable-alpine

# Custom nginx config will proxy /api to the server service
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
