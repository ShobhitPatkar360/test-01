# Specify the base image
FROM shubh360/node-image:04

# Set the working directory
WORKDIR /my-node-app 

# Copy package.json and package-lock.json
#COPY package*.json ./

# Install dependencies
#RUN npm init


# Copy the rest of the application code
COPY . .

# Set the environment variable
ENV PORT=3000
ENV TEXT="hello from env var"

# set the connection string
ENV CONN="mongodb://localhost:27017"

#RUN npm i express
RUN npm init -y
RUN npm i express mongoose

# Expose the port the app will listen on
EXPOSE $PORT



# Define the command to run the app
CMD ["node", "index.js"]
