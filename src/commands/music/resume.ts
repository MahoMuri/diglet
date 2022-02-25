import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "resume",
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the song."),
    description: "Resumes the song",
    category: "music",
    adminOnly: false,
    usage: "/resume",
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

        client.player.pause(false);
        const embed = new MessageEmbed()
            .setColor(bot.colors.GREEN_MUNSEL)
            .setDescription("▶ **Resumed!**");
        interaction.editReply({ embeds: [embed] });
    },
};
