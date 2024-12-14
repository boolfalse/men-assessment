
# Use Node.js 20
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy all into the working directory
COPY . .

# Install dependencies
RUN npm install

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
