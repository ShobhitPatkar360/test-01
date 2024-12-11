# Base image
FROM node:latest

# Set working directory
WORKDIR /my-app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Expose application port
EXPOSE 5000

# Run application
CMD ["node", "index.js"]