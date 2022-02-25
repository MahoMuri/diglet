import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "test",
    data: new SlashCommandBuilder().setName("test").setDescription("Meh"),
    description: "",
    category: "",
    adminOnly: false,
    usage: "",
    run: async (bot, interaction) => {
        if (interaction.user.id === "259313335076519936") {
            const data = await bot.randomStuff.joke({ type: "any" });

            bot.consola.log(data);
            interaction.deferReply();
            interaction.deleteReply();
        } else {
            interaction.deferReply();
            interaction.deleteReply();
        }
    },
};
