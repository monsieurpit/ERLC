import { EmbedBuilder } from "discord.js";
import type { GuildSettings } from "@workspace/db";

const accent = 0x3b82f6;

export function baseEmbed(settings: GuildSettings, title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(accent)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: `${settings.serverName} • ER:LC Operations` })
    .setTimestamp();
}

export function addImage(embed: EmbedBuilder, imageUrl: string | null | undefined): EmbedBuilder {
  if (imageUrl) {
    try {
      embed.setImage(new URL(imageUrl).toString());
    } catch {
      // Invalid optional image URLs are ignored so the command can still succeed.
    }
  }
  return embed;
}