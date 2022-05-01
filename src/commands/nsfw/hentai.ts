import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, TextChannel } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "hentai",
    data: new SlashCommandBuilder()
        .setName("hentai")
        .setDescription("Sends a random hentai gif!"),
    description: "Sends a random hentai gif!",
    category: "nsfw",
    adminOnly: false,
    usage: "/hentai",
    run: async (bot, interaction) => {
        const channel = <TextChannel>interaction.channel;

        if (!channel.nsfw) {
            const embed = new MessageEmbed()
                .setColor(bot.colors.UPSDELL_RED)
                .setDescription("❌ **You're not in an nsfw channel!**");
            await interaction.deleteReply();
            await interaction.followUp({ embeds: [embed], ephemeral: true });
            return;
        }

        const data = await bot.randomStuff.nekos({
            type: "hentai",
        });

        const embed = new MessageEmbed()
            .setTitle("Here, have some random hentai filthy cunt.")
            .setColor(bot.colors.RICH_BLACK)
            .setImage(data.image);
        interaction.editReply({ embeds: [embed] });
    },
};
