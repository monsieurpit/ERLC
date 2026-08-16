# Deployment instructions for single api-server workspace

This repository has been consolidated to a single deployable service: artifacts/api-server.

What I changed
- Root package.json now builds and starts only @workspace/api-server.
- Replit auto-run has been disabled/neutralized to avoid auto-deploy on Replit.
- Added artifacts/api-server/Dockerfile to build the TypeScript and run the compiled JS.
- Neutralized artifacts/api-react and artifacts/api-sandbox so they will not be deployed as services.
- Added .skipdeploy markers in neutralized artifact folders to prevent accidental deployment.

Required environment variables (set these in Railway for the single service):
- DISCORD_TOKEN (required) — your Discord bot token
- PORT (Railway sets this automatically)
- Any other secrets your bot uses (e.g., DATABASE_URL, OPENAI_API_KEY, SENTRY_DSN)

Railway recommended configuration
- Start Command: pnpm run start
  This runs the api-server build and then starts the compiled Node server.
- Node version: >= 18 (specified in package.json engines)
- Package manager: pnpm (pnpm is used by this workspace)

How to delete extra services in Railway (if they already exist)
1. Open Railway and go to your Project.
2. Under Services, select the unwanted service (api-react or api-sandbox).
3. Go to Settings → Danger Zone → Delete Service.

Local testing
1. Install: pnpm install
2. Build: pnpm run build
3. Run: PORT=3000 DISCORD_TOKEN=your_token pnpm run start
4. Confirm logs show "Server listening" and your bot logs in successfully.

If you want me to also remove the neutralized directories entirely (git rm), say so and I will remove them from the repository.
