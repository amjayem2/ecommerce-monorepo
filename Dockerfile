# ---- Base image ----
  FROM node:18 AS base
  WORKDIR /app
  COPY . .
  RUN npm install
  
  # ---- Build Backend (NestJS) ----
  FROM base AS backend-build
  WORKDIR /app/apps/backend
  RUN npm run build
  
  # ---- Build Web (Next.js) ----
  FROM base AS web-build
  WORKDIR /app/apps/web
  RUN npm run build
  
  # ---- Build Dashboard (Vite) ----
  FROM base AS dashboard-build
  WORKDIR /app/apps/dashboard
  RUN npm run build
  
  # ---- Final Image ----
  FROM node:18 AS final
  WORKDIR /app
  
  # Copy build outputs
  COPY --from=backend-build /app/apps/backend/dist /app/apps/backend/dist
  COPY --from=web-build /app/apps/web/.next /app/apps/web/.next
  COPY --from=dashboard-build /app/apps/dashboard/dist /app/apps/dashboard/dist
  COPY . .
  
  # Optional: Install only production deps if needed
  RUN npm install --omit=dev
  
  # Set environment
  ENV NODE_ENV=production
  ENV PORT=3000
  
  EXPOSE 3000
  
  # Start only one app (e.g. backend). You can modify this to serve web too.
  CMD ["node", "apps/backend/dist/main.js"]
  