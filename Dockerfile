# Use an official Node.js image as the build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json* ./

# Install dependencies (including dev dependencies)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Production stage – a slim runtime image
FROM node:18-alpine

WORKDIR /app

# Copy only the package.json and package-lock.json, then install only production dependencies
COPY package.json package-lock.json* ./
RUN npm install --only=production

# Copy the built app from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port the app runs on
EXPOSE 3002

# Start the application
CMD ["npm", "start"]
