import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "settings",
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("Manages the bot's settings")
        .addSubcommand((subCommand) =>
            subCommand
                .setName("warns")
                .setDescription("Change the max number of warns")
                .addNumberOption((option) =>
                    option
                        .setName("number")
                        .setDescription("The number of max warns")
                        .setMinValue(1)
                        .setRequired(true)
                )
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName("time")
                .setDescription("Change the duration of the timeout")
                .addStringOption((option) =>
                    option
                        .setName("duration")
                        .setDescription("The duration of the timeout")
                        .setRequired(true)
                )
        ),
    description: "Manages the bot's settings",
    category: "admin",
    adminOnly: true,
    usage: "/settings <option>",
    run: async (bot, interaction) => {
        const subCommand = interaction.options.getSubcommand();
    },
};
