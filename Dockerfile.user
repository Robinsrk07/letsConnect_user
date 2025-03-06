# Use the official Node.js image
FROM node:20.12.1

# Install a compatible npm version
RUN npm install -g npm@10

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies using npm with BuildKit caching
RUN --mount=type=cache,target=/root/.npm \
    npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your application
CMD ["node", "src/app.js"]
