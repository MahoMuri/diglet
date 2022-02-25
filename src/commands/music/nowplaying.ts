import { SlashCommandBuilder } from "@discordjs/builders";
import { stripIndents } from "common-tags";
import { MessageEmbed } from "discord.js";
import prettyMilliseconds from "pretty-ms";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "nowplaying",
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Displays the current playing track"),
    description: "Displays the current playing track",
    category: "music",
    adminOnly: false,
    usage: "/nowplaying",
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
        const songLength = currentlyPlaying.duration;
        const curTime = client.player.position;
        const charArray = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
        const trackLine = charArray.split("");
        const curPos = Math.floor((curTime / songLength) * trackLine.length);
        trackLine.splice(curPos, 1, "🔘");

        let loopMode = "None";
        if (client.player.trackRepeat) {
            loopMode = "Track";
        } else if (client.player.queueRepeat) {
            loopMode = "Queue";
        }

        const embed = new MessageEmbed()
            .setAuthor({
                name: "🎶 Now Playing:",
                iconURL: bot.user.displayAvatarURL(),
            })
            .setColor(bot.colors.DARK_ELECTRIC_BLUE)
            .setThumbnail(currentlyPlaying.displayThumbnail("3"))
            .setDescription(
                stripIndents`**[${currentlyPlaying.title}](${
                    currentlyPlaying.uri
                })**\n\n ${trackLine.join("")}\
                \`${prettyMilliseconds(curTime, {
                    colonNotation: true,
                    secondsDecimalDigits: 0,
                })}/${prettyMilliseconds(songLength, {
                    colonNotation: true,
                    secondsDecimalDigits: 0,
                })}\`\n\u2800`
            )
            .addFields(
                {
                    name: "Requested by:",
                    value: currentlyPlaying.requester.toString(),
                    inline: true,
                },
                {
                    name: "Paused:",
                    value: client.player.paused ? "Yes" : "No",
                    inline: true,
                },
                {
                    name: "Loop Mode:",
                    value: loopMode,
                    inline: true,
                }
            )
            .setFooter({
                text: `${bot.user.username} | MahoMuri © 2022`,
                iconURL: bot.user.displayAvatarURL(),
            });
        interaction.editReply({ embeds: [embed] });
    },
};
