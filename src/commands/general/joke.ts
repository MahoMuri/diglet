import { SlashCommandBuilder, spoiler } from "@discordjs/builders";
import { stripIndents } from "common-tags";
import { MessageEmbed } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "joke",
    data: new SlashCommandBuilder()
        .setName("joke")
        .setDescription("I'll tell you a joke!")
        .addStringOption((option) =>
            option
                .setName("category")
                .setDescription("The category of the joke")
                .addChoices([
                    ["Any", "any"],
                    ["Dark", "dark"],
                    ["Pun", "pun"],
                    ["Spooky", "spooky"],
                    ["Christmas", "christmas"],
                    ["Programming", "programming"],
                    ["Misc", "misc"],
                ])
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("blacklist")
                .setDescription("Blacklist some jokes")
                .addChoices([
                    ["NSFW", "nsfw"],
                    ["Religious", "religious"],
                    ["Political", "political"],
                    ["Racist", "racist"],
                    ["Sexist", "sexist"],
                    ["Explicit", "explicit"],
                ])
        ),
    description: "I'll tell you a joke!",
    category: "general",
    adminOnly: false,
    usage: "/joke <category> [blacklist]",
    run: async (bot, interaction) => {
        const category = interaction.options.getString("category");
        const blacklist = interaction.options.getString("blacklist");

        const data = await bot.randomStuff.joke({
            type: category,
            blacklist: blacklist || "",
        });

        let info: string;

        if (data.type === "twopart") {
            info = stripIndents`**Question:** *${data.setup}*
            ${spoiler(`**Answer:** *${data.delivery}*`)}`;
        } else if (data.type === "single") {
            info = stripIndents`**Joke:** *${data.joke}*`;
        }

        const embed = new MessageEmbed()
            .setTitle(`Heres a ${data.category} joke!`)
            .setColor(bot.colors.PRUSSIAN_BLUE)
            .setDescription(info);
        interaction.editReply({ embeds: [embed] });
    },
};
