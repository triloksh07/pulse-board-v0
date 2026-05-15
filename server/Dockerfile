# ==========================================
# Stage 1: Build the TypeScript code
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm (since I see pnpm-lock.yaml in your commits)
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install ALL dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of source code
COPY . .

# Compile TypeScript to the /dist folder
RUN pnpm run build

# ==========================================
# Stage 2: Production Image
# ==========================================
FROM node:22-alpine AS production

WORKDIR /app

# Enable pnpm again
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copy only dependency files
COPY package.json pnpm-lock.yaml ./

# Install ONLY production dependencies (keeps image small & secure)
# RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/node_modules ./node_modules
RUN pnpm prune --prod

# Copy the compiled JS files from the builder stage
COPY --from=builder /app/dist ./dist

# Expose your API port
EXPOSE 5000

# Start the server using the compiled JavaScript
CMD ["node", "dist/server.js"]