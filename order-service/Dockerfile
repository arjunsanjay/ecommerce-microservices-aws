FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# The order-service runs on port 5002
EXPOSE 5002
CMD [ "node", "server.js" ]