import { SlashCommandBuilder } from "@discordjs/builders";
import { stripIndents } from "common-tags";
import { ChannelType } from "discord-api-types/v9";
import { MessageEmbed, TextChannel } from "discord.js";
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
                    
                    Once you're there, edit the embed as you see fit. When you're done click on the 3 dots on the upper right and click **Get data link**

                    Copy the entire thing then type \`/embed <URL> [channel]\` in the channel you wish to send the embed you made. Or you can optionally add the channel
                    to where I would send the embed`
                );
            interaction.editReply({ embeds: [embed] });
            return;
        }

        const parsedURL = new URL(url);

        const base64 = parsedURL.searchParams.get("data");

        const json = JSON.parse(
            decodeURIComponent(Buffer.from(base64, "base64").toString())
        );

        const embed = new MessageEmbed(json.embed);

        channel
            .send({ embeds: [embed] })
            .then(() => {
                interaction.editReply("**Embed successfully sent!**");
            })
            .catch((err) => {
                const errEmbed = new MessageEmbed()
                    .setColor(bot.colors.UPSDELL_RED)
                    .setDescription(
                        `❌ **An Error Occured while processing this command! Please try again or contact a developer about this.**`
                    );
                interaction.editReply({ embeds: [errEmbed] });
                bot.consola.error(err);
            });
    },
};
