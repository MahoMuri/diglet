import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { stripIndents } from "common-tags";
import { ChannelType } from "discord-api-types/v9";
import { MessageEmbed, MessageEmbedOptions, TextChannel } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "embed",
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Posts an embed to a certain channel")
        .addStringOption((option) =>
            option.setName("url").setDescription("The URL of the embed builder")
        )
        .addChannelOption((option) =>
            option
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                .addChannelType(ChannelType.GuildText)
                .setName("channel")
                .setDescription(
                    "The text channel I would send the message embed"
                )
        ),
    description: "Posts an embed to a certain channel",
    category: "admin",
    adminOnly: true,
    usage: "/embed <json data> [channel]",
    run: async (bot, interaction) => {
        const url = interaction.options.getString("url");
        const channel =
            <TextChannel>interaction.options.getChannel("channel") ||
            <TextChannel>interaction.channel;

        if (!url) {
            const embed = new MessageEmbed()
                .setTitle("Create an embed here!")
                .setDescription(
                    stripIndents`Click [this link](https://glitchii.github.io/embedbuilder/) to got to the online embed builder.
                    
                    Once you're there, edit the embed as you see fit. When you're done click on the copy button and paste the data on [pastebin](https://pastebin.com).

                    Click on the submit button then copy the URL. On Discord, type \`/embed <URL> [channel]\` in the channel you wish to send the embed you made. Or you can optionally add the channel
                    to where I would send the embed`
                );
            interaction.editReply({ embeds: [embed] });
            return;
        }

        try {
            const parsedURL = new URL(url);
            let json: MessageEmbedOptions;

            if (parsedURL.hostname === "pastebin.com") {
                const { data } = await axios.get(
                    `https://pastebin.com/raw${parsedURL.pathname}`
                );

                json = data.embed;

                const embed = new MessageEmbed(json);

                channel
                    .send({ embeds: [embed] })
                    .then(() => {
                        interaction.editReply("**Embed successfully sent!**");
                    })
                    .catch((err) => {
                        const errEmbed = new MessageEmbed()
                            .setColor(bot.colors.UPSDELL_RED)
                            .setDescription(
                                `❌ **An Error Occurred while processing this command! Please try again or contact a developer about this.**`
                            );
                        interaction.editReply({ embeds: [errEmbed] });
                        bot.consola.error(err);
                    });
            } else {
                const embed = new MessageEmbed()
                    .setTitle("Wrong link!")
                    .setColor(bot.colors.UPSDELL_RED)
                    .setDescription(
                        "Please use [pastebin](http://pastebin.com) as the paste editor."
                    );

                interaction.editReply({ embeds: [embed] });
            }
        } catch (error) {
            bot.consola.error(error);
            const embed = new MessageEmbed()
                .setTitle("Something went wrong!")
                .setColor(bot.colors.UPSDELL_RED)
                .setDescription(
                    `I'm sorry but an unexpected error occurred, please contact the server's Tech Support for assistance!`
                );

            interaction.editReply({ embeds: [embed] });
        }
    },
};
