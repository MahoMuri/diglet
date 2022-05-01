import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, MessageEmbed } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "happy",
    data: new SlashCommandBuilder()
        .setName("happy")
        .setDescription("You are happy!"),
    description: "You are happy!",
    category: "general",
    adminOnly: false,
    usage: "/happy",
    run: async (bot, interaction) => {
        const author = <GuildMember>interaction.member;

        const data = await bot.randomStuff.anime({
            query: "happy",
        });

        const embed = new MessageEmbed()
            .setAuthor({
                name: `${author.displayName} is happy!`,
                iconURL: author.displayAvatarURL(),
            })
            .setColor(bot.colors.STAR_COMMAND_BLUE)
            .setImage(data.response)
            .setFooter({
                text: `${bot.user.username} | MahoMuri © 2022`,
                iconURL: bot.user.displayAvatarURL(),
            });
        interaction.editReply({ embeds: [embed] });
    },
};
