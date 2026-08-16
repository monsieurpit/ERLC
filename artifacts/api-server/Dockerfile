FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8

# Copy root workspace files and install dependencies
COPY package.json pnpm-workspace.yaml* pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod

# Copy repository files
COPY . .

# Build the api-server artifact
RUN node ./artifacts/api-server/build.mjs

# Runtime: run the compiled server
CMD ["node", "artifacts/api-server/dist/index.mjs"]
