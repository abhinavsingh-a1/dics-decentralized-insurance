# devops/docker/indexer.Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY indexer/package*.json ./
RUN npm install
COPY indexer/ .
CMD ["node", "listener.js"]
