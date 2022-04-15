import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { load } from "cheerio";
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
            const { data } = await axios.get(
                "https://pasteio.com/raw/xw5103AYUzzG"
            );

            const $ = load(data);

            bot.consola.log($("pre").text().replace("<\\pre>", ""));
            interaction.deleteReply();
        } else {
            interaction.deleteReply();
        }
    },
};
