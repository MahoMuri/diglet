import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, MessageEmbed } from "discord.js";
import { MusicClient } from "../../classes/MusicClient";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "play",
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song")
        .addStringOption((option) =>
            option
                .setName("song")
                .setDescription("The title or link of the song to play")
                .setRequired(true)
        ),
    description: "Plays a song",
    category: "music",
    adminOnly: false,
    usage: "/play <songTitle or songLink>",
    run: async (bot, interaction) => {
        const { guildId } = interaction;
        const member = <GuildMember>interaction.member;

        if (!member.voice.channel) {
            const embed = new MessageEmbed()
                .setColor(bot.colors.UPSDELL_RED)
                .setDescription("❌ **You're not in a voice channel!**");
            await interaction.deleteReply();
            await interaction.followUp({ embeds: [embed], ephemeral: true });
            return;
        }

        let client = bot.clients.get(guildId);

        if (!client) {
            client = new MusicClient(
                bot,
                bot.erela,
                guildId,
                member.voice.channelId,
                interaction.channelId
            );
            bot.clients.set(guildId, client);
        }

        if (client.player.playing) {
            const embed = new MessageEmbed()
                .setColor(bot.colors.UPSDELL_RED)
                .setDescription("❌ **I'm being used in a different VC!**");
            await interaction.deleteReply();
            await interaction.followUp({ embeds: [embed], ephemeral: true });
            return;
        }

        const searchTerm = interaction.options.getString("song");

        const searchResult = await client.search(searchTerm, interaction.user);

        switch (searchResult.loadType) {
            case "LOAD_FAILED": {
                const embed = new MessageEmbed()
                    .setColor(bot.colors.UPSDELL_RED)
                    .setDescription(
                        `❌ **Error occured while searching for ${searchTerm}! Please inform the dev ahout this for assistance**`
                    );
                await interaction.deleteReply();
                await interaction.followUp({
                    embeds: [embed],
                    ephemeral: true,
                });
                bot.consola.error(
                    searchResult.exception.severity,
                    searchResult.exception.message
                );
                break;
            }

            case "NO_MATCHES": {
                const embed = new MessageEmbed()
                    .setColor(bot.colors.UPSDELL_RED)
                    .setDescription(
                        `❌ **No matches found for ${searchTerm}!**`
                    );
                await interaction.deleteReply();
                await interaction.followUp({
                    embeds: [embed],
                    ephemeral: true,
                });
                break;
            }

            case "PLAYLIST_LOADED": {
                const embed = new MessageEmbed()
                    .setColor(bot.colors.GREEN_MUNSEL)
                    .setDescription(
                        `✅ **Enqueued ${searchResult.playlist.name}!**`
                    );
                interaction.editReply({ embeds: [embed] });

                client.play(interaction, searchResult.tracks);
                break;
            }

            case "TRACK_LOADED":
            case "SEARCH_RESULT": {
                const embed = new MessageEmbed()
                    .setColor(bot.colors.GREEN_MUNSEL)
                    .setDescription(
                        `✅ **Enqueued ${searchResult.tracks[0].title}!**`
                    );
                interaction.editReply({ embeds: [embed] });

                client.play(interaction, searchResult.tracks.slice(0, 1));
                break;
            }

            default:
                break;
        }
    },
};
