# Build stage
FROM node:20 AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
# Configure npm to work around SSL issues in Docker
RUN npm config set strict-ssl false
# Install dependencies
RUN npm install
# Re-enable SSL for security
RUN npm config set strict-ssl true
# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_FANFORGE_API_URL
ARG VITE_FANFORGE_API_KEY

# Set environment variables for build
ENV VITE_FANFORGE_API_URL=$VITE_FANFORGE_API_URL
ENV VITE_FANFORGE_API_KEY=$VITE_FANFORGE_API_KEY

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built assets from builder stage
COPY --from=builder /app/dist .

# Copy nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]