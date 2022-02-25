import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, TextChannel } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "tits",
    data: new SlashCommandBuilder()
        .setName("tits")
        .setDescription("Sends titties!")
        .addBooleanOption((option) =>
            option
                .setName("gif")
                .setDescription("Wether to send as a gif or a jpg")
        ),
    description: "Sends titties!",
    category: "nsfw",
    adminOnly: false,
    usage: "/tits",
    run: async (bot, interaction) => {
        const channel = <TextChannel>interaction.channel;

        const isGif = interaction.options.getBoolean("gif");

        if (!channel.nsfw) {
            const embed = new MessageEmbed()
                .setColor(bot.colors.UPSDELL_RED)
                .setDescription("❌ **You're not in an nsfw channel!**");
            await interaction.deleteReply();
            await interaction.followUp({ embeds: [embed], ephemeral: true });
            return;
        }

        const data = await bot.randomStuff.nekos({
            type: isGif ? "boobs" : "tits",
        });

        const embed = new MessageEmbed()
            .setTitle("Here, have some boobs ya filthy cunt.")
            .setColor(bot.colors.RICH_BLACK)
            .setImage(data.url);
        interaction.editReply({ embeds: [embed] });
    },
};
