import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, MessageEmbed } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "pat",
    data: new SlashCommandBuilder()
        .setName("pat")
        .setDescription("Pat someone!")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The person to pat!")
                .setRequired(true)
        ),
    description: "Pat someone!",
    category: "general",
    adminOnly: false,
    usage: "/pat <@user>",
    run: async (bot, interaction) => {
        const author = <GuildMember>interaction.member;
        const member = <GuildMember>interaction.options.getMember("user");

        const data = await bot.randomStuff.anime({
            type: "pat",
            limit: 1,
        });

        const embed = new MessageEmbed()
            .setAuthor({
                name: `${author.displayName} pats ${
                    member === author ? "themselves" : member.displayName
                }!`,
                iconURL: author.displayAvatarURL(),
            })
            .setColor(bot.colors.DARK_ELECTRIC_BLUE)
            .setImage(data[0].url)
            .setFooter({
                text: `${bot.user.username} | MahoMuri © 2022`,
                iconURL: bot.user.displayAvatarURL(),
            });
        interaction.editReply({ embeds: [embed] });
    },
};
