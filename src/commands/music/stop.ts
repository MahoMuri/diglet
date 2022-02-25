import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "stop",
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stops playing the song and clears the queue."),
    description: "Stops playing the song and clears the queue.",
    category: "music",
    adminOnly: false,
    usage: "/stop",
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

        client.player.queue.clear();
        client.player.stop();
        client.currentlyPlaying = null;
        const embed = new MessageEmbed()
            .setColor(bot.colors.GREEN_MUNSEL)
            .setDescription("✅ **Stopped playing!**");
        interaction.editReply({ embeds: [embed] });
    },
};
