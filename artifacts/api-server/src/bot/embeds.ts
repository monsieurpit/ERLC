import { EmbedBuilder } from "discord.js";
import type { GuildSettings } from "@workspace/db";

const colors = {
  blue: 0x2563eb,
  green: 0x22c55e,
  yellow: 0xfacc15,
  red: 0xef4444,
};

export function baseEmbed(settings: GuildSettings, title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(colors.blue)
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

function brandedEmbed(settings: GuildSettings, color: number, title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(color)
    .setAuthor({ name: `${settings.serverName} • Roleplay Automation` })
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: `Liberty County Emergency Management • ${settings.serverName}` })
    .setTimestamp();
}

export function sessionVoteEmbed(
  settings: GuildSettings,
  votesRequired: number,
  currentVotes: number,
  initiatedBy: string,
  imageUrl?: string | null,
): EmbedBuilder {
  const embed = brandedEmbed(
    settings,
    colors.blue,
    "🚓 Emergency Response: Liberty County — Session Vote",
    `**${settings.serverName}** is organizing an ER:LC gaming session!\n\n` +
      `📚 **What is ER:LC?**\n` +
      "Emergency Response: Liberty County is a realistic emergency services roleplay experience where players take on roles as police officers, firefighters, paramedics, and civilians in a detailed virtual county.",
  )
    .addFields(
      {
        name: "📋 Session Details",
        value: "• Professional roleplay environment\n• Multiple emergency service departments\n• Realistic emergency scenarios\n• Community-driven gameplay",
        inline: false,
      },
      {
        name: "🎯 Votes Required to Start",
        value: `**${votesRequired}** members must vote`,
        inline: true,
      },
      {
        name: "📊 Current Vote Count",
        value: `**${currentVotes}** vote${currentVotes === 1 ? "" : "s"} received`,
        inline: true,
      },
      {
        name: "⏰ Session Status",
        value: "🟡 Pending — Awaiting votes",
        inline: true,
      },
      {
        name: "👥 Expected Roles",
        value: "• Police Officers\n• Fire Department\n• EMS/Paramedics\n• Civilians\n• Dispatchers",
        inline: true,
      },
      {
        name: "🛡️ Roleplay Guidelines",
        value: "• Realistic communication\n• Follow chain of command\n• Use proper 10-codes\n• Maintain character immersion",
        inline: true,
      },
      {
        name: "⚡ Quick Info",
        value: `**Server:** ${settings.serverName}\n**Game:** Emergency Response: Liberty County\n**Platform:** Roblox`,
        inline: true,
      },
    )
    .setFooter({ text: `Session vote initiated by ${initiatedBy} • Liberty County Emergency Management` });

  return addImage(embed, imageUrl);
}

export function sessionStartedEmbed(
  settings: GuildSettings,
  initiatedBy: string,
  imageUrl?: string | null,
): EmbedBuilder {
  const embed = brandedEmbed(
    settings,
    colors.green,
    "🚨 SESSION ALERT",
    "🚨 **ER:LC SESSION ACTIVE — ALL UNITS RESPOND!**\n\n**EMERGENCY SERVICES DEPLOYMENT INITIATED**",
  )
    .addFields(
      {
        name: "📡 Dispatch Alert",
        value: `*"All available units, we have a Code 1 — Emergency Services Activation. Multiple departments are requesting immediate backup for ${settings.serverName} operations. All personnel report to stations immediately."*`,
        inline: false,
      },
      {
        name: "🚨 Urgent — Mandatory Reporting",
        value: "**All voters must join the game within 15 minutes.**\n⏰ This is not optional — attendance is required.",
        inline: false,
      },
      {
        name: "⚠️ Disciplinary Warning",
        value: "Failure to respond will result in:\n• Moderation action\n• Removal from future session voting\n• Department disciplinary measures",
        inline: false,
      },
      {
        name: "🕘 Response Deadline",
        value: `**REPORT BY:** Within 15 minutes\n**SERVER CODE:** \`${settings.serverCode}\``,
        inline: true,
      },
      {
        name: "🏢 Department Assignments",
        value: "👮 **Police:** Patrol units needed\n🚒 **Fire:** Rescue operators ready\n🚑 **EMS:** Ambulance crews standby\n📡 **Dispatch:** Communications active\n👥 **Civilians:** Roleplay scenarios begin",
        inline: true,
      },
      {
        name: "📋 Session Expectations",
        value: "• Maintain radio discipline\n• Follow department protocols\n• Use realistic 10-codes\n• Professional conduct required\n• Chain of command respected",
        inline: true,
      },
      {
        name: "🎯 Mission Objectives",
        value: "• Respond to emergency calls\n• Maintain public safety\n• Coordinate multi-agency response\n• Provide realistic roleplay\n• Support community training",
        inline: false,
      },
    )
    .setFooter({ text: `Emergency session activated by ${initiatedBy} • Liberty County Emergency Management` });

  return addImage(embed, imageUrl);
}

export function lowMemberCountEmbed(settings: GuildSettings): EmbedBuilder {
  return brandedEmbed(
    settings,
    colors.yellow,
    "⚠️ LOW PLAYER ALERT — @everyone",
    "🟡 **CODE YELLOW — EMERGENCY PERSONNEL SHORTAGE**\n\n**URGENT DISPATCH ALERT**",
  )
    .addFields(
      {
        name: "📡 Emergency Services Bulletin",
        value: `*"All available units, we have a Code Yellow — Critical Personnel Shortage in Liberty County. Multiple emergency situations are pending response due to low staffing. Immediate backup requested from all off-duty personnel."*`,
        inline: false,
      },
      {
        name: "⚠️ Situation Critical",
        value: `The ER:LC server is experiencing dangerously low emergency services staffing levels.\n\n**Server Code:** \`${settings.serverCode}\``,
        inline: false,
      },
      {
        name: "🆘 Immediate Assistance Required",
        value: "**All community members must join immediately**\n• Emergency calls are backing up\n• Public safety is at risk\n• Multiple departments are undermanned\n• Civilian scenarios need participants",
        inline: false,
      },
      {
        name: "📊 Current Staffing Levels",
        value: "🔴 **CRITICAL** — Below minimum operational capacity\n⚠️ Session at immediate risk of suspension\n📉 Emergency response times degraded",
        inline: true,
      },
      {
        name: "🚨 Departments Affected",
        value: "👮 **Police:** Units needed for patrol\n🚒 **Fire:** Stations understaffed\n🚑 **EMS:** Ambulances unavailable\n📡 **Dispatch:** Overwhelmed with calls\n🚦 **Traffic:** No enforcement coverage",
        inline: true,
      },
      {
        name: "⏰ Response Urgency",
        value: "**JOIN IMMEDIATELY OR SESSION ENDS**\n\n🎯 Target: Return to full operational status\n🔔 Timeline: Next 10–15 minutes critical\n🚨 Priority: All hands on deck",
        inline: false,
      },
      {
        name: "🛠️ How to Help",
        value: "1️⃣ Join the Roblox game now\n2️⃣ Select any emergency service role\n3️⃣ Report to your department\n4️⃣ Await dispatch assignments\n5️⃣ Maintain professional roleplay",
        inline: true,
      },
      {
        name: "🏆 Community Impact",
        value: "Your participation matters:\n• Keeps training scenarios active\n• Maintains realistic emergency response\n• Supports fellow community members\n• Preserves session quality",
        inline: true,
      },
    )
    .setFooter({ text: `Emergency alert issued by Liberty County Emergency Management • ${settings.serverName}` });
}

export function sessionShutdownEmbed(settings: GuildSettings, reason: string): EmbedBuilder {
  return brandedEmbed(
    settings,
    colors.red,
    "🔴 CODE RED — EMERGENCY SERVICES SUSPENDED",
    "**OFFICIAL DEPARTMENT CLOSURE NOTICE**",
  )
    .addFields(
      {
        name: "📡 Final Dispatch Transmission",
        value: `*"All units, Command is issuing a Code Red — Emergency Services Suspension for ${settings.serverName} due to ${reason}. All emergency operations are being terminated effective immediately until further notice. All personnel return to quarters."*`,
        inline: false,
      },
      {
        name: "💔 Session Terminated",
        value: `The ER:LC server session has officially shut down due to **${reason}**.\n\n🚨 **All members must leave the server immediately to avoid moderation.**\n**Server Code:** \`${settings.serverCode}\``,
        inline: false,
      },
      {
        name: "📉 Operational Failure Analysis",
        value: `**Primary Cause:** ${reason}\n**Contributing Factors:**\n• Insufficient community participation\n• Emergency calls going unanswered\n• Public safety compromised\n• Training objectives not met\n• Department coordination failed`,
        inline: true,
      },
      {
        name: "⚠️ Impact Assessment",
        value: "• Reduced training opportunities\n• Decreased roleplay quality\n• Member engagement concerns\n• Department readiness affected\n• Session reliability questioned",
        inline: true,
      },
      {
        name: "📊 Session Statistics",
        value: "**Duration:** Ended early\n**Peak Players:** Below operational minimum\n**Departments Active:** Insufficient coverage\n**Emergency Calls:** Multiple unanswered\n**Training Value:** Objectives not achieved",
        inline: true,
      },
      {
        name: "💪 Improvement Mandate",
        value: "**Tomorrow we MUST do better!**\n\n🎯 **Required Actions:**\n• Increase member commitment\n• Better attendance planning\n• More active recruitment\n• Enhanced communication\n• Stronger community engagement",
        inline: false,
      },
      {
        name: "📅 Next Session Objectives",
        value: "1️⃣ Pre-session roll call\n2️⃣ Department staffing confirmation\n3️⃣ Commitment verification\n4️⃣ Training schedule review\n5️⃣ Emergency scenario planning",
        inline: true,
      },
      {
        name: "🏆 Community Responsibility",
        value: "Every member matters:\n• Your participation builds the community\n• Consistent attendance shows dedication\n• Professional roleplay improves the experience\n• Reliability creates better sessions\n• Teamwork makes departments successful",
        inline: true,
      },
      {
        name: "🔔 Leadership Message",
        value: `*"This shutdown is disappointing but not permanent. We believe in this community's potential. Tomorrow is a new opportunity to demonstrate our commitment to emergency services roleplay. Let's learn from today and come back stronger."*`,
        inline: false,
      },
    )
    .setFooter({ text: `Emergency Services suspended by Liberty County Emergency Management • ${settings.serverName}` });
}