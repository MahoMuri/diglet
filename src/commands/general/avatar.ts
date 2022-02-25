import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "avatar",
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Displays yours, or another user's avatar.")
        .addUserOption((option) =>
            option.setName("user").setDescription("The user to get the avatar")
        ),
    description: "Displays yours, or another user's avatar.",
    category: "general",
    adminOnly: false,
    usage: "/avatar [@user]",
    run: async (bot, interaction) => {
        const user = interaction.options.getUser("user") || interaction.user;

        const embed = new MessageEmbed()
            .setAuthor({
                name: user.tag,
                iconURL: user.displayAvatarURL(),
                url: user.displayAvatarURL({
                    dynamic: true,
                    size: 256,
                }),
            })
            .setColor(bot.colors.STAR_COMMAND_BLUE)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 256 }));
        interaction.editReply({ embeds: [embed] });
    },
};
