import { eq } from "drizzle-orm";
import { db, guildSettingsTable, type GuildSettings } from "@workspace/db";

export async function getGuildSettings(guildId: string): Promise<GuildSettings> {
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
  const current = await getGuildSettings(guildId);
  const updated = await db
    .update(guildSettingsTable)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(guildSettingsTable.id, current.id))
    .returning();

  return updated[0];
}