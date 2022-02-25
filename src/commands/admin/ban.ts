import { SlashCommandBuilder } from "@discordjs/builders";
import { stripIndents } from "common-tags";
import { GuildMember, Message, MessageEmbed } from "discord.js";
import { Command } from "../../interfaces/Command";
import { Utilities } from "../../utils/Utilities";

export const command: Command = {
    name: "ban",
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bans a user")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to ban")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("The reason for the ban")
        ),
    description: "Bans a user",
    category: "admin",
    adminOnly: true,
    usage: "/ban <user> [reason]",
    run: async (bot, interaction) => {
        const toBan = <GuildMember>interaction.options.getMember("user");
        const reason = interaction.options.getString("reason");

        const promptEmbed = new MessageEmbed()
            .setColor(bot.colors.DEEP_SAFFRON)
            .setTitle("⚠ Are you sure?")
            .setDescription(
                stripIndents`You are about to ban ${toBan} for reasons: \`${
                    reason || "None specified "
                }\`
                
                Are you sure about this?
                Click on the respective buttons below`
            )
            .setFooter({
                text: "You have 60 seconds until the buttons deactivate.",
            });

        await interaction.editReply({
            embeds: [promptEmbed],
            components: [Utilities.createButtons()],
        });

        const message = <Message>await interaction.fetchReply();

        Utilities.promptMessage(message, interaction.user, 60).then(
            (button) => {
                if (!button) {
                    return;
                }

                switch (button.customId) {
                    case "confirm": {
                        toBan
                            .ban({ days: 3, reason })
                            .then((bannedMember) => {
                                const embed = new MessageEmbed()
                                    .setTitle(`✅ Ban Success!`)
                                    .setColor(bot.colors.GREEN_MUNSEL)
                                    .setDescription(
                                        stripIndents`${bannedMember} was successfully banned!
                                    I am deleting thier messages from a few days ago.`
                                    )
                                    .setFooter({
                                        text: "I hope you know what you're doing...",
                                    });
                                button.reply({
                                    embeds: [embed],
                                    ephemeral: true,
                                });
                            })
                            .catch((err) => {
                                const embed = new MessageEmbed()
                                    .setTitle(`❌ Ban Failed!`)
                                    .setColor(bot.colors.UPSDELL_RED)
                                    .setDescription(
                                        stripIndents`Ban attempt for ${toBan} has failed!
                                        Kindly contact tech support for assitance.`
                                    )
                                    .setFooter({
                                        text: "I hope you know what you're doing...",
                                    });
                                button.reply({
                                    embeds: [embed],
                                    ephemeral: true,
                                });
                                bot.consola.error(err);
                            });
                        break;
                    }

                    case "deny": {
                        const embed = new MessageEmbed()
                            .setTitle(`❌ Ban Canceled!`)
                            .setColor(bot.colors.UPSDELL_RED)
                            .setDescription(
                                stripIndents`Ban attempt for ${toBan} was successfully canceled!
                                They get to stay longer, for now...`
                            )
                            .setFooter({
                                text: "I hope you know what you're doing...",
                            });
                        button.reply({ embeds: [embed], ephemeral: true });
                        break;
                    }

                    default:
                        break;
                }
            }
        );
    },
};
