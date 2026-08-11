import {
  ApplicationCommandOptionType,
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

const text = (name: string, optionName: string, optionDescription: string, required = true) =>
  new SlashCommandBuilder()
    .setName(name)
    .setDescription(optionDescription)
    .addStringOption((option) =>
      option.setName(optionName).setDescription(optionDescription).setRequired(required),
    );

export const commandBuilders = [
  new SlashCommandBuilder()
    .setName("config-roles")
    .setDescription("Configure the roles allowed to run session and infraction commands.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption((option) =>
      option.setName("session_role").setDescription("Role allowed to manage sessions").setRequired(true),
    )
    .addRoleOption((option) =>
      option.setName("infraction_role").setDescription("Role allowed to issue infractions").setRequired(true),
    ),
  text("set-server-name", "name", "ER:LC server name").setDefaultMemberPermissions(
    PermissionFlagsBits.Administrator,
  ),
  text("set-server-code", "code", "ER:LC server code").setDefaultMemberPermissions(
    PermissionFlagsBits.Administrator,
  ),
  new SlashCommandBuilder()
    .setName("session-vote")
    .setDescription("Open a vote to start an ER:LC session.")
    .addIntegerOption((option) =>
      option.setName("votes_required").setDescription("Votes needed to start").setMinValue(1).setMaxValue(1000).setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("image_url").setDescription("Optional image URL").setRequired(false),
    ),
  new SlashCommandBuilder()
    .setName("session-start")
    .setDescription("Manually announce that an ER:LC session has started.")
    .addStringOption((option) => option.setName("image_url").setDescription("Optional image URL").setRequired(false)),
  new SlashCommandBuilder().setName("session-low").setDescription("Announce that the ER:LC server needs more members."),
  new SlashCommandBuilder()
    .setName("session-shutdown")
    .setDescription("Announce that the ER:LC session has shut down.")
    .addStringOption((option) => option.setName("reason").setDescription("Shutdown reason").setRequired(true)),
  new SlashCommandBuilder()
    .setName("infract")
    .setDescription("Issue a documented infraction.")
    .addUserOption((option) => option.setName("user").setDescription("User being infracted").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Reason").setRequired(true))
    .addStringOption((option) => option.setName("punishment").setDescription("Punishment").setRequired(true))
    .addStringOption((option) =>
      option
        .setName("appeal")
        .setDescription("Whether an appeal is permitted")
        .setRequired(true)
        .addChoices({ name: "Yes", value: "yes" }, { name: "No", value: "no" }),
    ),
  new SlashCommandBuilder()
    .setName("say")
    .setDescription("Send a message without displaying the command interaction.")
    .addStringOption((option) => option.setName("message").setDescription("Message to send").setRequired(true)),
  new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Send a custom embed.")
    .addStringOption((option) => option.setName("title").setDescription("Embed title").setRequired(true))
    .addStringOption((option) => option.setName("description").setDescription("Embed description").setRequired(true))
    .addStringOption((option) => option.setName("footer").setDescription("Footer text").setRequired(true))
    .addStringOption((option) => option.setName("image_url").setDescription("Optional image URL").setRequired(false))
    .addStringOption((option) => option.setName("button_text").setDescription("Optional link button label").setRequired(false))
    .addStringOption((option) => option.setName("button_url").setDescription("Optional link button URL").setRequired(false)),
  new SlashCommandBuilder().setName("membercount").setDescription("Show human and bot member counts."),
  new SlashCommandBuilder()
    .setName("welcome-setup")
    .setDescription("Configure the welcome message for new members.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option.setName("type").setDescription("Welcome message format").setRequired(true).addChoices(
        { name: "Plain text", value: "plain_text" },
        { name: "Embed", value: "embed" },
      ),
    )
    .addChannelOption((option) =>
      option.setName("channel").setDescription("Channel where welcomes are sent").addChannelTypes(ChannelType.GuildText).setRequired(true),
    )
    .addStringOption((option) => option.setName("message").setDescription("Welcome message").setRequired(true)),
  new SlashCommandBuilder().setName("help").setDescription("List every ER:LC bot command and what it does."),
].map((command) => command.toJSON());

export const commandNames = new Set(commandBuilders.map((command) => command.name));

export const optionType = ApplicationCommandOptionType;