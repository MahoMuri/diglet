import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, MessageEmbed } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "hug",
    data: new SlashCommandBuilder()
        .setName("hug")
        .setDescription("Hug someone!")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The person to hug!")
                .setRequired(true)
        ),
    description: "Hug someone!",
    category: "general",
    adminOnly: false,
    usage: "/hug <@user>",
    run: async (bot, interaction) => {
        const author = <GuildMember>interaction.member;
        const member = <GuildMember>interaction.options.getMember("user");

        const data = await bot.randomStuff.anime({ query: "hug" });

        const embed = new MessageEmbed()
            .setAuthor({
                name: `${author.displayName} hugged ${
                    member === author ? "themselves" : member.displayName
                }!`,
                iconURL: author.displayAvatarURL(),
            })
            .setColor(bot.colors.DARK_ELECTRIC_BLUE)
            .setImage(data.response)
            .setFooter({
                text: `${bot.user.username} | MahoMuri © 2022`,
                iconURL: bot.user.displayAvatarURL(),
            });
        interaction.editReply({ embeds: [embed] });
    },
};
