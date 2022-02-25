import { CommandInteraction, Interaction } from "discord.js";
import { Event } from "../interfaces/Event";
import GuildModel from "../models/GuildModel";

export const event: Event = {
    name: "interactionCreate",
    run: async (bot, interaction: Interaction) => {
        if (!interaction.isCommand()) {
            return;
        }

        const { guildId } = interaction;
        let guildConfig = await GuildModel.findOne({ guildId });

        if (!guildConfig) {
            guildConfig = await GuildModel.create({
                guildId,
            });
        }

        const command = bot.commands.get(interaction.commandName);

        if (command) {
            await interaction.deferReply();
            command.run(bot, <CommandInteraction>interaction);
        }
    },
};
