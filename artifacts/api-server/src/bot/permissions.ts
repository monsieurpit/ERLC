import { PermissionFlagsBits, type ChatInputCommandInteraction } from "discord.js";
import type { GuildSettings } from "@workspace/db";

export function isAdministrator(interaction: ChatInputCommandInteraction): boolean {
  return Boolean(interaction.memberPermissions?.has(PermissionFlagsBits.Administrator));
}

export async function requireAdministrator(interaction: ChatInputCommandInteraction): Promise<boolean> {
  if (isAdministrator(interaction)) return true;
  await interaction.reply({ content: "This command requires the Administrator permission.", ephemeral: true });
  return false;
}

export async function requireConfiguredRole(
  interaction: ChatInputCommandInteraction,
  settings: GuildSettings,
  role: "session" | "infraction",
): Promise<boolean> {
  if (isAdministrator(interaction)) return true;
  const roleId = role === "session" ? settings.sessionRoleId : settings.infractionRoleId;
  const member = interaction.member;
  const roles = member && "roles" in member ? member.roles : undefined;
  const hasRole = Boolean(
    roleId &&
      roles &&
      (Array.isArray(roles) ? roles.includes(roleId) : roles.cache.has(roleId)),
  );
  if (!hasRole) {
    await interaction.reply({
      content: `You need the configured ${role} permissions role to use this command.`,
      ephemeral: true,
    });
  }
  return hasRole;
}