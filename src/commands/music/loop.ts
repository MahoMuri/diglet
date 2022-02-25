import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "loop",
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Loops the queue")
        .addStringOption((option) =>
            option
                .setName("mode")
                .setDescription("Wether to loop the track or the entire queue.")
                .addChoices([
                    ["Track", "track"],
                    ["Queue", "queue"],
                    ["Clear", "clear"],
                ])
                .setRequired(true)
        ),
    description: "Loops the queue",
    category: "music",
    adminOnly: false,
    usage: "/loop",
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

        const mode = interaction.options.getString("mode");
        let description: string;

        switch (mode) {
            case "track": {
                if (!client.player.trackRepeat) {
                    client.player.setTrackRepeat(true);
                    description = "🔂 **Looped Track!**";
                } else {
                    client.player.setTrackRepeat(false);
                    description = "🔂 **Unlooped Track!**";
                }
                break;
            }

            case "queue": {
                if (!client.player.queueRepeat) {
                    client.player.setQueueRepeat(true);
                    description = "🔁 **Looped Queue!**";
                } else {
                    client.player.setQueueRepeat(false);
                    description = "🔁 **Unlooped Queue!**";
                }
                break;
            }

            case "clear": {
                client.player.setTrackRepeat(false);
                client.player.setQueueRepeat(false);
                description = "🔄 **Cleared loops!**";
                break;
            }

            default:
                break;
        }

        const embed = new MessageEmbed()
            .setColor(bot.colors.GREEN_MUNSEL)
            .setDescription(description);
        interaction.editReply({ embeds: [embed] });
    },
};
