import { SlashCommandBuilder } from "@discordjs/builders";
import { stripIndents } from "common-tags";
import { MessageEmbed, User } from "discord.js";
import ms from "ms";
import prettyMilliseconds from "pretty-ms";
import { Command } from "../../interfaces/Command";
import { Utilities } from "../../utils/Utilities";

export const command: Command = {
    name: "queue",
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Displays the queue.")
        .addStringOption((option) =>
            option
                .setName("mode")
                .setDescription("Optional mode to set")
                .setChoices([["Clear", "clear"]])
        ),
    description: "Displays the queue.",
    category: "music",
    adminOnly: false,
    usage: "/queue",
    run: async (bot, interaction) => {
        const client = bot.clients.get(interaction.guildId);

        if (!client || client.player.queue.totalSize === 0) {
            const embed = new MessageEmbed()
                .setColor(bot.colors.UPSDELL_RED)
                .setDescription("❌ **The queue is empty!**");
            await interaction.deleteReply();
            await interaction.followUp({ embeds: [embed], ephemeral: true });
            return;
        }

        const mode = interaction.options.getString("mode");

        if (mode === "clear") {
            client.player.queue.clear();

            if (client.player.queueRepeat) {
                client.player.setQueueRepeat(false);
            }

            const embed = new MessageEmbed()
                .setColor(bot.colors.GREEN_MUNSEL)
                .setDescription("✅ **Cleared the queue!**");
            interaction.editReply({ embeds: [embed] });
            return;
        }

        const info: string[] = [];
        info.push(
            `__**Now Playing:**__\n1. **${
                client.currentlyPlaying.title
            }** | \`${prettyMilliseconds(client.currentlyPlaying.duration, {
                colonNotation: true,
                secondsDecimalDigits: 0,
            })}\` | *Requested by: __${
                (client.currentlyPlaying.requester as User).tag
            }__*\n`
        );

        if (client.player.queue.size > 0) {
            client.player.queue.forEach(async (track, i) => {
                const user = <User>track.requester;

                if (i === 0) {
                    info.push(
                        `__**Up next:**__\n${i + 2}. **${
                            track.title
                        }** | \`${prettyMilliseconds(track.duration, {
                            colonNotation: true,
                            secondsDecimalDigits: 0,
                        })}\` | *Requested by: __${user.tag}__*`
                    );
                } else {
                    info.push(
                        stripIndents`${i + 2}. **${
                            track.title
                        }** | \`${prettyMilliseconds(track.duration, {
                            colonNotation: true,
                            secondsDecimalDigits: 0,
                        })}\` | *Requested by: __${user.tag}__*\n\n`
                    );
                }
            });
        }

        // Declare empty array of MessageEmbeds
        const embeds: MessageEmbed[] = [];
        const pages = Math.ceil(client.player.queue.totalSize / 10); // Rounds off to the smallest integer greater than or equal to its numeric argument.

        // Declare footer message
        const footerMessage = `${client.player.queue.totalSize - 1} song${
            client.player.queue.totalSize === 1 ? "" : "s"
        } in the queue | Total Length: ${prettyMilliseconds(
            client.player.queue.duration,
            {
                colonNotation: true,
                secondsDecimalDigits: 0,
            }
        )}`;

        // Initial page start and end
        let start = 0;
        let end = 10;

        let loopMode = "None";
        if (client.player.trackRepeat) {
            loopMode = "Track";
        } else if (client.player.queueRepeat) {
            loopMode = "Queue";
        }

        // Begin pushing embeds with 10 items each to array
        for (let i = 0; i < pages; i += 1) {
            const embed = new MessageEmbed()
                .setTitle(
                    `🎶 Queue for ${interaction.guild.name} | Loop: ${loopMode}`
                )
                .setColor(bot.colors.INDIGO_DYE)
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setFooter({
                    text: `Page: ${i + 1}/${pages} | ${footerMessage}`,
                    iconURL: interaction.guild.iconURL(),
                });
            if (i < 1) {
                embeds.push(
                    embed.setDescription(info.slice(start, end).join("\n"))
                );
            } else {
                embeds.push(
                    embed.setDescription(
                        info.slice((start += 10), (end += 10)).join("\n")
                    )
                );
            }
        }

        if (embeds.length === 1) {
            interaction.editReply({ embeds: [embeds[0]] });
        } else {
            Utilities.createSlider({
                interaction,
                embeds,
                otherButtons: {
                    firstButton: {
                        enabled: true,
                        position: 0,
                    },
                    lastButton: {
                        enabled: true,
                        position: 3,
                    },
                    deleteButton: {
                        enabled: true,
                        position: 2,
                    },
                },
                buttons: [
                    { name: "first", emoji: "⏮", style: "SECONDARY" },
                    { name: "foward", emoji: "▶", style: "PRIMARY" },
                    { name: "delete", emoji: "🗑", style: "DANGER" },
                    { name: "back", emoji: "◀", style: "PRIMARY" },
                    { name: "last", emoji: "⏭", style: "SECONDARY" },
                ],
                time: ms("5m"),
            });
        }
    },
};
