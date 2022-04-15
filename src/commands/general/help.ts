import { SlashCommandBuilder } from "@discordjs/builders";
import { stripIndents } from "common-tags";
import { MessageEmbed } from "discord.js";
import _ from "lodash";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "help",
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Displays available commands.")
        .addStringOption((option) =>
            option
                .setName("command")
                .setDescription("Gets help for a specific command")
        ),
    description: "Displays available commands.",
    category: "general",
    adminOnly: false,
    usage: "/help [command]",
    run: async (bot, interaction) => {
        function getAll() {
            const embed = new MessageEmbed()
                .setTitle(
                    `<:blurplesupport:953346706513219695> ${bot.user.username} Help`
                )
                .setDescription(
                    `Below are the list of commands available to **__${bot.user.username}__**. To get help for a specific command, type \`/help <commandName>\`. If there's any errors or mistakes, don't hesitate to DM **__<@259313335076519936>__** for support.`
                )
                .setThumbnail(
                    bot.user.displayAvatarURL({
                        format: "png",
                        dynamic: true,
                        size: 256,
                    })
                )
                .setColor(bot.colors.STAR_COMMAND_BLUE);

            // Map all the commands
            // with the specific category
            const commands = (category: string) =>
                bot.commands
                    .filter((cmd) => cmd.category === category)
                    .map((cmd) => `/${cmd.name}`)
                    .join("\n");

            // Map all the categories
            bot.categories.map((cat) =>
                embed.addField(
                    `**${_.capitalize(cat)}:**`,
                    stripIndents`\`\`\`fix
                        ${commands(cat)}
                        \`\`\``,
                    true
                )
            );
            return embed;
        }

        const cmdHelp = interaction.options.getString("command");
        let embed: MessageEmbed;
        if (!cmdHelp) {
            embed = getAll();
        }

        interaction.editReply({ embeds: [embed] });
    },
};
