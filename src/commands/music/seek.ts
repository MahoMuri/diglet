import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import prettyMilliseconds from "pretty-ms";
import { Command } from "../../interfaces/Command";
import { Utilities } from "../../utils/Utilities";

export const command: Command = {
    name: "seek",
    data: new SlashCommandBuilder()
        .setName("seek")
        .setDescription("Seeks to a specific time in the track.")
        .addStringOption((option) =>
            option
                .setName("time")
                .setDescription("The time to seek to.")
                .setRequired(true)
        ),
    description: "Seeks to a specific time in the track.",
    category: "music",
    adminOnly: false,
    usage: "/seek <time>",
    run: async (bot, interaction) => {
        const client = bot.clients.get(interaction.guildId);

        if (!client || !client.currentlyPlaying) {
            const embed = new MessageEmbed()
                .setColor(bot.colors.UPSDELL_RED)
                .setDescription("❌ **There is no song playing!**");
            await interaction.deleteReply();
            await interaction.followUp({ embeds: [embed], ephemeral: true });
            return;
        }

        const { currentlyPlaying } = client;
        const regex = /\d+/g;
        /**
         * time[0] = hours
         * time[1] = minutes
         * time[2] = seconds
         */
        const time = interaction.options.getString("time").match(regex);

        const intTime: number[] = [];
        time.forEach((element: string) => {
            intTime.push(parseInt(element, 10));
        });

        let ms: number;
        if (time.length === 1) {
            ms = Utilities.toMilliseconds({
                seconds: intTime[0],
            });
        } else if (time.length === 2) {
            ms = Utilities.toMilliseconds({
                minutes: intTime[0],
                seconds: intTime[1],
            });
        } else if (time.length === 3) {
            ms = Utilities.toMilliseconds({
                hours: intTime[0],
                minutes: intTime[1],
                seconds: intTime[2],
            });
        }

        if (ms > currentlyPlaying.duration) {
            const embed = new MessageEmbed()
                .setDescription(
                    "❌ **Seeked time cannot be longer than the song duration**"
                )
                .setColor(bot.colors.UPSDELL_RED);
            interaction.editReply({ embeds: [embed] });
        } else {
            client.player.seek(ms);
            const embed = new MessageEmbed()
                .setColor(bot.colors.GREEN_MUNSEL)
                .setDescription(
                    `✅ **Track seeked to \`${prettyMilliseconds(ms, {
                        colonNotation: true,
                        secondsDecimalDigits: 0,
                    })}\`**`
                );
            interaction.editReply({ embeds: [embed] });
        }
    },
};
