import { EmbedBuilder } from "discord.js";

export function helpEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x2563eb)
    .setTitle("ER:LC Operations Command Center")
    .setDescription("Use the commands below to coordinate professional ER:LC sessions and moderation.")
    .addFields(
      { name: "Setup", value: "`/config-roles` • `/set-server-name` • `/set-server-code` • `/welcome-setup`" },
      { name: "Sessions", value: "`/session-vote votes_required [image_url]` • `/session-start [image_url]` • `/session-low` • `/session-shutdown reason`" },
      { name: "Moderation", value: "`/infract user reason punishment appeal`" },
      { name: "Utilities", value: "`/say message` • `/embed title description footer [image_url] [button_text] [button_url]` • `/membercount` • `/help`" },
    )
    .setFooter({ text: "Only configured roles can run protected operations." })
    .setTimestamp();
}