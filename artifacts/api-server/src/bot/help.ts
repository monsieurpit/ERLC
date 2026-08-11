import { EmbedBuilder } from "discord.js";

export function helpEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x2563eb)
    .setTitle("ER:LC Operations Command Center")
    .setDescription("Use the commands below to coordinate professional ER:LC sessions, welcomes, and moderation.")
    .addFields(
      { name: "/config-roles `session_role` `infraction_role`", value: "Admin only. Save the roles that may manage sessions and issue infractions.", inline: false },
      { name: "/set-server-name `name`", value: "Admin only. Save the ER:LC server name used in announcements.", inline: false },
      { name: "/set-server-code `code`", value: "Admin only. Save the ER:LC server code shown in session messages.", inline: false },
      { name: "/welcome-setup `type` `channel` `message`", value: "Admin only. Configure a plain-text or embed welcome message. Placeholders: `{user}`, `{server}`, `{serverCode}`.", inline: false },
      { name: "/session-vote `votes_required` `[image_url]`", value: "Session role required. Open a button-based vote and automatically start the session when the goal is reached.", inline: false },
      { name: "/session-start `[image_url]`", value: "Session role required. Manually announce a session start and display the saved server code.", inline: false },
      { name: "/session-low", value: "Session role required. Encourage members to join a low-population server.", inline: false },
      { name: "/session-shutdown `reason`", value: "Session role required. Announce the shutdown and instruct members to leave immediately to avoid moderation.", inline: false },
      { name: "/infract `user` `reason` `punishment` `appeal`", value: "Infraction role required. Record and announce a moderation infraction.", inline: false },
      { name: "/say `message`", value: "Send a message without leaving the visible command interaction in the channel.", inline: false },
      { name: "/embed `title` `description` `footer` `[image_url]` `[button_text]` `[button_url]`", value: "Send a custom embed with an optional image and link button.", inline: false },
      { name: "/membercount", value: "Show the number of human members, bots, and the total server population.", inline: false },
      { name: "/help", value: "Show this command reference.", inline: false },
    )
    .setFooter({ text: "Only configured roles can run protected operations." })
    .setTimestamp();
}