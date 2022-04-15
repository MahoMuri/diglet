import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, MessageEmbed } from "discord.js";
import ms from "ms";
import prettyMilliseconds from "pretty-ms";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "timeout",
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Timeout a user")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to timeout")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("time")
                .setDescription("The time to Timeout")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("The reason for the timeout")
        ),
    description: "Times out a user",
    category: "admin",
    adminOnly: true,
    usage: "/timeout <user> <time> [reason]",
    run: async (bot, interaction) => {
        let toMute = <GuildMember>interaction.options.getMember("user");
        const time = interaction.options.getString("time");
        const reason =
            interaction.options.getString("reason") || "None Specified";

        if (toMute.isCommunicationDisabled()) {
            const embed = new MessageEmbed()
                .setColor(bot.colors.UPSDELL_RED)
                .setDescription(`${toMute} is already timed out!`);
            interaction.editReply({ embeds: [embed] });
            return;
        }

        toMute = toMute as GuildMember;

        await toMute
            .timeout(ms(time), reason)
            .catch((err) => bot.consola.error(err));

        const embed = new MessageEmbed()
            .setTitle(
                `${(toMute as GuildMember).displayName} has been timed out!`
            )
            .setColor(bot.colors.GREEN_MUNSEL)
            .setDescription(
                `**Timed Out User:** ${toMute}
                **User Id:** ${toMute.user.id}
                **Timeout Duration:** ${prettyMilliseconds(ms(time), {
                    verbose: true,
                    secondsDecimalDigits: 0,
                })}
                **Reason:** ${reason}`
            );
        interaction.editReply({ embeds: [embed] });
    },
};
