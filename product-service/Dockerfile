FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# The product-service runs on port 5001
EXPOSE 5001
CMD [ "node", "Server.js" ]