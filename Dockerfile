# Use the official Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Copy all files
COPY . .

# Install root dependencies (if any)
RUN if [ -f package.json ]; then npm install; fi

# Install dependencies for each app
RUN cd apps/backend && npm install
RUN cd /app/apps/web && npm install
RUN cd /app/apps/dashboard && npm install

# Build frontend apps
RUN cd /app/apps/web && npm run build
RUN cd /app/apps/dashboard && npm run build

# Install concurrently globally to run all apps
RUN npm install -g concurrently

# Expose ports (adjust as needed)
EXPOSE 3000 5173 8000

# Start all apps
CMD concurrently \
  "cd apps/backend && npm run start" \
  "cd apps/web && npm run start" \
  "cd apps/dashboard && npm run preview"
