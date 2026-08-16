FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install pnpm (match workspace packageManager)
RUN npm install -g pnpm@10.26.1

# Copy root workspace files and install dependencies
COPY package.json pnpm-workspace.yaml* pnpm-lock.yaml* ./
# Allow creating/updating the lockfile during image build so the Docker build
# won't fail when pnpm-workspace.yaml or package.json has overrides that
# aren't present in a checked-in pnpm-lock.yaml. CI (Railway) already uses
# --no-frozen-lockfile in railway.json, but some Docker builds used
# --frozen-lockfile which caused failures in the platform build logs.
RUN pnpm install --no-frozen-lockfile --prod

# Copy repository files
COPY . .

# Build the api-server artifact
RUN node ./artifacts/api-server/build.mjs

# Runtime: run the compiled server
CMD ["node", "artifacts/api-server/dist/index.mjs"]
