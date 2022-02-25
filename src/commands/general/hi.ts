import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, MessageEmbed } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "hi",
    data: new SlashCommandBuilder()
        .setName("hi")
        .setDescription("Say hi someone!")
        .addUserOption((option) =>
            option.setName("user").setDescription("The person to hug!")
        ),
    description: "Hug someone!",
    category: "general",
    adminOnly: false,
    usage: "/hi <@user>",
    run: async (bot, interaction) => {
        const author = <GuildMember>interaction.member;
        const member = <GuildMember>interaction.options.getMember("user");

        const data = await bot.randomStuff.anime({
            type: "hi",
            limit: 1,
        });

        const embed = new MessageEmbed()
            .setAuthor({
                name: `${author.displayName} says hi to ${
                    member === author
                        ? "themselves"
                        : member.displayName || "everyone"
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
