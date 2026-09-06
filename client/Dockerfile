# Build as : docker build --build-arg BUILD_CONFIG=production -t client-aicompanion:1 .
# Run as : docker run -d -p 8000:80 --name client-ai-companion client-aicompanion:1
# Change name and access port as needed.

# Stage 1: Build the Angular app
FROM node:24 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG BUILD_CONFIG=production
RUN npm run build -- --configuration=${BUILD_CONFIG}

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/client/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
