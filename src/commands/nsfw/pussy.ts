import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, TextChannel } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "pussy",
    data: new SlashCommandBuilder()
        .setName("pussy")
        .setDescription("Have some pussies!")
        .addBooleanOption((option) =>
            option
                .setName("gif")
                .setDescription("Wether to send as a gif or a jpg")
        ),
    description: "Have some pussies!",
    category: "nsfw",
    adminOnly: false,
    usage: "/pussy",
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
            type: isGif ? "pussy" : "pussy_jpg",
        });

        const embed = new MessageEmbed()
            .setTitle("Here, have a pussy ya filthy cunt.")
            .setColor(bot.colors.RICH_BLACK)
            .setImage(data.url);
        interaction.editReply({ embeds: [embed] });
    },
};
