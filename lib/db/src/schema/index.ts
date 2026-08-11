import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const guildSettingsTable = pgTable(
  "guild_settings",
  {
    id: serial("id").primaryKey(),
    guildId: varchar("guild_id", { length: 32 }).notNull(),
    serverName: text("server_name").notNull().default("ER:LC Server"),
    serverCode: varchar("server_code", { length: 128 }).notNull().default("Not configured"),
    sessionRoleId: varchar("session_role_id", { length: 32 }),
    infractionRoleId: varchar("infraction_role_id", { length: 32 }),
    welcomeType: varchar("welcome_type", { length: 16 }),
    welcomeChannelId: varchar("welcome_channel_id", { length: 32 }),
    welcomeMessage: text("welcome_message"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    guildIdUnique: uniqueIndex("guild_settings_guild_id_unique").on(table.guildId),
  }),
);

export const sessionVotesTable = pgTable(
  "session_votes",
  {
    id: serial("id").primaryKey(),
    guildId: varchar("guild_id", { length: 32 }).notNull(),
    channelId: varchar("channel_id", { length: 32 }).notNull(),
    messageId: varchar("message_id", { length: 32 }),
    voteKey: varchar("vote_key", { length: 64 }).notNull(),
    votesRequired: integer("votes_required").notNull(),
    voterIds: text("voter_ids").array().notNull().default([]),
    imageUrl: text("image_url"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => ({
    voteKeyUnique: uniqueIndex("session_votes_vote_key_unique").on(table.voteKey),
  }),
);

export const infractionsTable = pgTable("infractions", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 32 }).notNull(),
  moderatorId: varchar("moderator_id", { length: 32 }).notNull(),
  userId: varchar("user_id", { length: 32 }).notNull(),
  reason: text("reason").notNull(),
  punishment: text("punishment").notNull(),
  appealAllowed: boolean("appeal_allowed").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type GuildSettings = typeof guildSettingsTable.$inferSelect;
export type SessionVote = typeof sessionVotesTable.$inferSelect;