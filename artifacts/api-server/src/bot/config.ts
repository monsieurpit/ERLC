import { eq } from "drizzle-orm";
import { db, guildSettingsTable, type GuildSettings } from "@workspace/db";

export async function getGuildSettings(guildId: string): Promise<GuildSettings> {
  // A row is created lazily the first time the bot sees a guild. This keeps
  // setup idempotent and lets every command read one consistent configuration.
  const existing = await db
    .select()
    .from(guildSettingsTable)
    .where(eq(guildSettingsTable.guildId, guildId))
    .limit(1);

  if (existing[0]) return existing[0];

  const inserted = await db
    .insert(guildSettingsTable)
    .values({ guildId })
    .returning();

  return inserted[0];
}

export async function updateGuildSettings(
  guildId: string,
  values: Partial<Omit<GuildSettings, "id" | "guildId" | "createdAt">>,
): Promise<GuildSettings> {
  // Always load first so updates work whether or not an admin has run setup.
  const current = await getGuildSettings(guildId);
  const updated = await db
    .update(guildSettingsTable)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(guildSettingsTable.id, current.id))
    .returning();

  return updated[0];
}