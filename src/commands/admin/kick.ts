import { SlashCommandBuilder } from "@discordjs/builders";
import { stripIndents } from "common-tags";
import { GuildMember, Message, MessageEmbed } from "discord.js";
import { Command } from "../../interfaces/Command";
import { Utilities } from "../../utils/Utilities";

export const command: Command = {
    name: "kick",
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kicks a user")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to kick")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("The reason for the kick")
        ),
    description: "Kicks a user",
    category: "admin",
    adminOnly: true,
    usage: "/kick <user> [reason]",
    run: async (bot, interaction) => {
        const toKick = <GuildMember>interaction.options.getMember("user");
        const reason = interaction.options.getString("reason");

        const promptEmbed = new MessageEmbed()
            .setColor(bot.colors.DEEP_SAFFRON)
            .setTitle("⚠ Are you sure?")
            .setDescription(
                stripIndents`You are about to kick ${toKick} for reasons: \`${
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
                        toKick
                            .kick(reason)
                            .then((kickedMember) => {
                                const embed = new MessageEmbed()
                                    .setTitle(`✅ Kick Success!`)
                                    .setColor(bot.colors.GREEN_MUNSEL)
                                    .setDescription(
                                        stripIndents`${kickedMember} was successfully kicked!
                                        They will be missed... maybe.`
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
                                    .setTitle(`❌ Kick Failed!`)
                                    .setColor(bot.colors.UPSDELL_RED)
                                    .setDescription(
                                        stripIndents`Kick attempt for ${toKick} has failed!
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
                            .setTitle(`❌ Kick Canceled!`)
                            .setColor(bot.colors.UPSDELL_RED)
                            .setDescription(
                                stripIndents`Kick attempt for ${toKick} was successfully canceled!
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
