# Base image
FROM node:latest

# Set working directory
WORKDIR /my-app

# Use BuildKit to mount the secret during the build
RUN --mount=type=secret,id=my_secret cat /run/secrets/my_secret > /my-app/config.yaml

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Expose application port
EXPOSE 5000

# Run application
CMD ["node", "index.js"]
