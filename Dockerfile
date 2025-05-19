# Dockerfile

# ========== 1. Base image ==========
FROM node:18-alpine AS base
WORKDIR /app
COPY . .

# ========== 2. Build phase ==========
FROM base AS build
RUN npm install
RUN npm run build

# ========== 3. Production run ==========
FROM node:18-alpine AS runner
WORKDIR /app

# Copy built apps
COPY --from=build /app .

# Install only prod deps
RUN npm install --omit=dev

# Expose server port
EXPOSE 3000

# Run the server
CMD ["npm", "run", "start"]
