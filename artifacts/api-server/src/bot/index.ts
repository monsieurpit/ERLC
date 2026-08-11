import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  Interaction,
  type ButtonInteraction,
  type ChatInputCommandInteraction,
  type GuildMember,
} from "discord.js";
import { and, eq } from "drizzle-orm";
import { db, infractionsTable, sessionVotesTable } from "@workspace/db";
import { logger } from "../lib/logger";
import { getGuildSettings, updateGuildSettings } from "./config";
import { commandBuilders } from "./commands";
import { addImage, baseEmbed } from "./embeds";
import { helpEmbed } from "./help";
import { requireAdministrator, requireConfiguredRole } from "./permissions";
import { randomBytes } from "node:crypto";

const token = process.env.DISCORD_TOKEN;
if (!token) throw new Error("DISCORD_TOKEN must be set to run the Discord bot.");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

function optionalUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).toString();
  } catch {
    return null;
  }
}

async function replyEmbed(interaction: ChatInputCommandInteraction, embed: EmbedBuilder): Promise<void> {
  await interaction.reply({ embeds: [embed] });
}

async function handleCommand(interaction: ChatInputCommandInteraction): Promise<void> {
  if (!interaction.guildId || !interaction.guild) {
    await interaction.reply({ content: "This command can only be used inside a server.", ephemeral: true });
    return;
  }

  const settings = await getGuildSettings(interaction.guildId);
  const name = interaction.commandName;

  if (name === "config-roles") {
    if (!(await requireAdministrator(interaction))) return;
    await updateGuildSettings(interaction.guildId, {
      sessionRoleId: interaction.options.getRole("session_role", true).id,
      infractionRoleId: interaction.options.getRole("infraction_role", true).id,
    });
    await interaction.reply({ content: "Session and infraction permission roles have been saved.", ephemeral: true });
    return;
  }

  if (name === "set-server-name" || name === "set-server-code") {
    if (!(await requireAdministrator(interaction))) return;
    const value = interaction.options.getString(name === "set-server-name" ? "name" : "code", true).trim();
    await updateGuildSettings(interaction.guildId, name === "set-server-name" ? { serverName: value } : { serverCode: value });
    await interaction.reply({ content: `${name === "set-server-name" ? "Server name" : "Server code"} saved successfully.`, ephemeral: true });
    return;
  }

  if (name === "welcome-setup") {
    if (!(await requireAdministrator(interaction))) return;
    await updateGuildSettings(interaction.guildId, {
      welcomeType: interaction.options.getString("type", true),
      welcomeChannelId: interaction.options.getChannel("channel", true).id,
      welcomeMessage: interaction.options.getString("message", true),
    });
    await interaction.reply({ content: "Welcome messages have been configured.", ephemeral: true });
    return;
  }

  if (name.startsWith("session-") && !(await requireConfiguredRole(interaction, settings, "session"))) return;
  if (name === "infract" && !(await requireConfiguredRole(interaction, settings, "infraction"))) return;

  if (name === "session-vote") {
    // Store the vote before accepting button clicks so the vote remains
    // authoritative across message updates and process restarts.
    const required = interaction.options.getInteger("votes_required", true);
    const imageUrl = optionalUrl(interaction.options.getString("image_url"));
    const voteKey = randomBytes(12).toString("hex");
    const embed = addImage(
      baseEmbed(settings, `${settings.serverName} • Session Vote`, `A session vote is now open. **${required}** vote${required === 1 ? "" : "s"} required to start.`)
        .addFields({ name: "How to vote", value: "Click the button below if you are ready and required to join the session." }, { name: "Progress", value: `0 / ${required}` }),
      imageUrl,
    );
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId(`session_vote:${voteKey}`).setLabel("Vote to join").setStyle(ButtonStyle.Primary),
    );
    const message = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
    await db.insert(sessionVotesTable).values({
      guildId: interaction.guildId,
      channelId: interaction.channelId,
      messageId: message.id,
      voteKey,
      votesRequired: required,
      imageUrl,
    });
    return;
  }

  if (name === "session-start") {
    await replyEmbed(interaction, addImage(baseEmbed(settings, `${settings.serverName} • Session Started`, `The ER:LC session has officially started.\n\n**Server Code:** \`${settings.serverCode}\`\n\nReport to your assigned departments and follow server procedures.`), optionalUrl(interaction.options.getString("image_url"))));
    return;
  }

  if (name === "session-low") {
    await replyEmbed(interaction, baseEmbed(settings, `${settings.serverName} • Low Member Count`, `The server currently has a low member count. Join the session and help bring the city to life.\n\n**Server Code:** \`${settings.serverCode}\``));
    return;
  }

  if (name === "session-shutdown") {
    const reason = interaction.options.getString("reason", true);
    await replyEmbed(interaction, baseEmbed(settings, `${settings.serverName} • Session Shutdown`, `The ER:LC server has shut down due to **${reason}**.\n\n**All members must leave the server immediately to avoid moderation.**\n\nServer code: \`${settings.serverCode}\``).setColor(0xdc2626));
    return;
  }

  if (name === "infract") {
    const user = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason", true);
    const punishment = interaction.options.getString("punishment", true);
    const appealAllowed = interaction.options.getString("appeal", true) === "yes";
    await db.insert(infractionsTable).values({
      guildId: interaction.guildId,
      moderatorId: interaction.user.id,
      userId: user.id,
      reason,
      punishment,
      appealAllowed,
    });
    await replyEmbed(interaction, new EmbedBuilder()
      .setColor(0xf59e0b)
      .setTitle("Moderation Infraction")
      .setDescription(`**${interaction.user.tag}** has infracted **${user.tag}**.`)
      .addFields({ name: "Reason", value: reason }, { name: "Punishment", value: punishment }, { name: "Appeal permitted", value: appealAllowed ? "Yes" : "No" })
      .setFooter({ text: settings.serverName })
      .setTimestamp());
    return;
  }

  if (name === "say") {
    await interaction.reply({ content: "Sending…", ephemeral: true });
    if (interaction.channel?.isSendable()) {
      await interaction.channel.send(interaction.options.getString("message", true));
    }
    await interaction.deleteReply();
    return;
  }

  if (name === "embed") {
    const title = interaction.options.getString("title", true);
    const description = interaction.options.getString("description", true);
    const footer = interaction.options.getString("footer", true);
    const imageUrl = optionalUrl(interaction.options.getString("image_url"));
    const buttonText = interaction.options.getString("button_text");
    const buttonUrl = optionalUrl(interaction.options.getString("button_url"));
    const embed = addImage(new EmbedBuilder().setColor(0x2563eb).setTitle(title).setDescription(description).setFooter({ text: footer }).setTimestamp(), imageUrl);
    const components = buttonText && buttonUrl
      ? [new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder().setLabel(buttonText).setURL(buttonUrl).setStyle(ButtonStyle.Link))]
      : [];
    await interaction.reply({ embeds: [embed], components });
    return;
  }

  if (name === "membercount") {
    const members = await interaction.guild.members.fetch();
    const humans = members.filter((member) => !member.user.bot).size;
    const bots = members.size - humans;
    await replyEmbed(interaction, baseEmbed(settings, `${settings.serverName} • Member Count`, `**Human members:** ${humans}\n**Bots:** ${bots}\n**Total:** ${members.size}`));
    return;
  }

  if (name === "help") {
    await replyEmbed(interaction, helpEmbed());
  }
}

async function handleVote(interaction: ButtonInteraction): Promise<void> {
  if (!interaction.guildId) {
    await interaction.reply({ content: "This vote can only be used inside a server.", ephemeral: true });
    return;
  }
  const voteKey = interaction.customId.slice("session_vote:".length);
  const existing = await db.select().from(sessionVotesTable).where(and(eq(sessionVotesTable.voteKey, voteKey), eq(sessionVotesTable.active, true))).limit(1);
  const vote = existing[0];
  if (!vote) {
    await interaction.reply({ content: "This session vote is no longer active.", ephemeral: true });
    return;
  }
  if (vote.voterIds.includes(interaction.user.id)) {
    await interaction.reply({ content: "Your vote has already been counted.", ephemeral: true });
    return;
  }
  const voters = [...vote.voterIds, interaction.user.id];
  const settings = await getGuildSettings(interaction.guildId);
  if (voters.length >= vote.votesRequired) {
    // Mark the vote inactive before announcing completion. This prevents a
    // second click racing with the completion message and starting twice.
    await db.update(sessionVotesTable).set({ voterIds: voters, active: false, completedAt: new Date() }).where(eq(sessionVotesTable.id, vote.id));
    await interaction.update({ components: [] });
    if (interaction.channel?.isSendable()) {
      await interaction.channel.send({
        embeds: [baseEmbed(settings, `${settings.serverName} • Session Started`, `${settings.serverName} has begun a session because the vote goal was reached!\n\n**Required members:** ${voters.map((id) => `<@${id}>`).join(" ")}\n**Server Code:** \`${settings.serverCode}\``).setColor(0x16a34a)],
      });
    }
  } else {
    await db.update(sessionVotesTable).set({ voterIds: voters }).where(eq(sessionVotesTable.id, vote.id));
    const message = await interaction.message.fetch();
    const currentEmbed = message.embeds[0];
    const updated = currentEmbed
      ? EmbedBuilder.from(currentEmbed).setFields({ name: "How to vote", value: "Click the button below if you are ready and required to join the session." }, { name: "Progress", value: `${voters.length} / ${vote.votesRequired}` })
      : undefined;
    await interaction.update({ embeds: updated ? [updated] : undefined });
    await interaction.followUp({ content: `Vote counted. Progress: ${voters.length} / ${vote.votesRequired}.`, ephemeral: true });
  }
}

async function handleMemberJoin(member: GuildMember): Promise<void> {
  // Welcome configuration is guild-scoped and can be changed without a
  // restart, so it is fetched when each member joins.
  const settings = await getGuildSettings(member.guild.id);
  if (!settings.welcomeChannelId || !settings.welcomeMessage) return;
  const channel = await member.guild.channels.fetch(settings.welcomeChannelId);
  if (!channel?.isTextBased()) return;
  const message = settings.welcomeMessage
    .replaceAll("{user}", `<@${member.id}>`)
    .replaceAll("{server}", settings.serverName)
    .replaceAll("{serverCode}", settings.serverCode);
  if (settings.welcomeType === "embed") {
    await channel.send({ embeds: [new EmbedBuilder().setColor(0x2563eb).setTitle(`Welcome to ${settings.serverName}`).setDescription(message).setTimestamp()] });
  } else {
    await channel.send(message);
  }
}

export function startDiscordBot(): void {
  client.once("clientReady", async (readyClient) => {
    logger.info({ user: readyClient.user.tag, guilds: readyClient.guilds.cache.size }, "Discord bot connected");
    for (const guild of readyClient.guilds.cache.values()) {
      try {
        await guild.commands.set(commandBuilders);
      } catch (error) {
        logger.error({ err: error, guildId: guild.id }, "Failed to register guild commands");
      }
    }
  });
  client.on("interactionCreate", async (interaction: Interaction) => {
    try {
      if (interaction.isButton() && interaction.customId.startsWith("session_vote:")) await handleVote(interaction);
      else if (interaction.isChatInputCommand()) await handleCommand(interaction);
    } catch (error) {
      logger.error({ err: error, command: interaction.isChatInputCommand() ? interaction.commandName : "button" }, "Discord interaction failed");
      if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: "Something went wrong while processing that request. Please try again.", ephemeral: true });
      }
    }
  });
  client.on("guildMemberAdd", (member) => {
    handleMemberJoin(member).catch((error) => logger.error({ err: error, guildId: member.guild.id }, "Welcome message failed"));
  });
  client.on("error", (error) => logger.error({ err: error }, "Discord client error"));
  client.login(token).catch((error) => {
    logger.error({ err: error }, "Discord login failed");
    process.exitCode = 1;
  });
}