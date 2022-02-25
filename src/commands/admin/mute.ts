import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "mute",
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Mutes a user")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to mute")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("time")
                .setDescription("The time to mute")
                .setRequired(true)
        ),
    description: "Mutes a user",
    category: "admin",
    adminOnly: true,
    usage: "/mute <user>",
    run: async (bot, interaction) => {
        // TODO: make mute command
    },
};
