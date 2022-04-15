import { SlashCommandBuilder } from "@discordjs/builders";
import { stripIndents } from "common-tags";
import { GuildMember, MessageEmbed } from "discord.js";
import { Command } from "../../interfaces/Command";
import { Utilities } from "../../utils/Utilities";

export const command: Command = {
    name: "userinfo",
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Displays the user's info.")
        .addUserOption((option) =>
            option.setName("user").setDescription("The user to display")
        ),
    description: "Displays the users info",
    category: "admin",
    adminOnly: true,
    usage: "/userinfo",
    run: async (bot, interaction) => {
        const member =
            <GuildMember>interaction.options.getMember("user") ??
            <GuildMember>interaction.member;

        const roles =
            member.roles.cache
                .filter((role) => role !== interaction.guild.roles.everyone)
                .toJSON()
                .join(",\n") || "None";

        const active = member.presence?.activities.length > 0;
        const embed = new MessageEmbed()
            .setAuthor({
                name: `${member.displayName}'s Info`,
                iconURL: member.user.displayAvatarURL(),
            })
            .setColor(bot.colors.PRUSSIAN_BLUE)
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                {
                    name: "Member Information",
                    value: stripIndents`**Display Name:** ${member.displayName}
                    **Joined At:** ${Utilities.formatDate(member.joinedAt)}
                    **Roles:** 
                    ${roles}

                    `,
                    inline: true,
                },
                {
                    name: "User Information",
                    value: stripIndents`**ID:** ${member.id}
                    **Username:** ${member.user.username}
                    **User Tag:** ${member.user.tag}
                    **Created At:** ${Utilities.formatDate(
                        member.user.createdAt
                    )}`,
                    inline: true,
                }
            );

        if (active) {
            const presence = member.presence.activities[0].type;
            const activity = member.presence.activities[0];
            bot.consola.log(activity);
            if (presence === "CUSTOM") {
                embed.addField(
                    "Custom Status:",
                    `${
                        activity.emoji
                            ? `${activity.emoji} ${activity.state}`
                            : activity.state
                    }`
                );
            } else {
                embed.addField(
                    `Currently ${
                        presence[0] + presence.toLowerCase().slice(1)
                    }`,
                    stripIndents`**${
                        presence[0] + presence.toLowerCase().slice(1)
                    }**: ${activity.name}`
                );
            }
        }

        interaction.editReply({ embeds: [embed] });
    },
};
