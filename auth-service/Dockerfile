# Step 1: Base Image - Start with a pre-built foundation.
FROM node:18-alpine

# Step 2: Working Directory - Create a home for our app inside the image.
WORKDIR /app

# Step 3: Copy Dependencies Manifest - Bring in the list of ingredients.
COPY package*.json ./

# Step 4: Install Dependencies - "Bake" the dependencies layer.
RUN npm install

# Step 5: Copy Application Code - Add our unique recipe.
COPY . .

# Step 6: Expose Port - Tell the world which door to knock on.
EXPOSE 5000

# Step 7: Run Command - Define what happens when the container starts.
CMD [ "node", "server.js" ]