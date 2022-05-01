import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
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
                "https://pastebin.com/raw/hkuX9ht8"
            );

            bot.consola.log(data.embed);
            axios
                .request({
                    method: "GET",
                    url: "https://random-stuff-api.p.rapidapi.com/anime",
                    params: { channel: "2", query: "cute" },
                    headers: {
                        Authorization: "O9zJtcnIZET9",
                        "X-RapidAPI-Host": "random-stuff-api.p.rapidapi.com",
                        "X-RapidAPI-Key":
                            "9f5444c5damsh2092622a84c4c68p12d3edjsnb1822ccdfb7f",
                    },
                })
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
            interaction.deleteReply();
        } else {
            interaction.deleteReply();
        }
    },
};
