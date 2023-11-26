# Use a Node.js base image with TypeScript support
FROM node:lts-slim as builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies including TypeScript
RUN npm install

# Copy the rest of your application's source code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Use a new stage to keep the final image small
FROM node:lts-slim

WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy compiled JavaScript from the builder stage
COPY --from=builder /usr/src/app/dist ./

# Define the command to run your app (adjust if your main file is named differently)
CMD ["node", "index.js"]
