import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "skip",
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song"),
    description: "Skips the current song",
    category: "music",
    adminOnly: false,
    usage: "/skip",
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

        client.player.stop();
        const embed = new MessageEmbed()
            .setColor(bot.colors.GREEN_MUNSEL)
            .setDescription("✅ **Skipped!**");
        interaction.editReply({ embeds: [embed] });
    },
};
