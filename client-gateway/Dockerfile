# --- Stage 1: The "Builder" ---
# Use a Node.js image to build our React app
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Run the production build script
RUN npm run build

# --- Stage 2: The "Server" ---
# Use a lightweight Nginx image to serve the static files
FROM nginx:stable-alpine

# Copy the built files from the "builder" stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy our custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (the default HTTP port Nginx listens on)
EXPOSE 80