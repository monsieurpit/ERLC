# ER:LC Operations Discord Bot

Production-ready Discord bot for Roblox Emergency Response: Liberty County communities.

The bot is written in JavaScript/TypeScript and uses Discord.js 14 for modern slash commands and buttons. Discord.js 14 requires **Node.js 18 or newer**; Node 14 cannot support the requested modern interaction features reliably.

## Required environment variables

- `DISCORD_TOKEN` — Discord bot token
- `DATABASE_URL` — PostgreSQL connection string

See `.env.example` for the complete list.

## Discord Developer Portal setup

1. Create an application and bot at the Discord Developer Portal.
2. Enable the **Server Members Intent** and **Message Content Intent** under Bot settings.
3. Invite the bot with the `bot` and `applications.commands` scopes.
4. Grant it permission to view channels, send messages, embed links, use slash commands, and manage messages where required.

The bot registers slash commands per server when it connects, so new commands appear immediately.

## First-time server setup

1. Run `/config-roles` as an Administrator.
2. Run `/set-server-name` and `/set-server-code`.
3. Optionally run `/welcome-setup`. Welcome templates support `{user}`, `{server}`, and `{serverCode}`.
4. Use `/help` to view all commands.

## Railway

Deploy from the repository root with the included `railway.json`. Add `DISCORD_TOKEN` and a PostgreSQL service; Railway exposes the PostgreSQL connection as `DATABASE_URL`. The Railway configuration requests Node 20, which satisfies the Discord.js runtime requirement.

The process also serves `/api/healthz` for a lightweight health check while maintaining the Discord gateway connection.