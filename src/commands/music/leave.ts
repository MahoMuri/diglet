import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, MessageEmbed } from "discord.js";
import { MusicClient } from "../../classes/MusicClient";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "leave",
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leaves the VC."),
    description: "Leaves the VC.",
    category: "music",
    adminOnly: false,
    usage: "/leave",
    run: async (bot, interaction) => {
        const { guildId } = interaction;
        const member = <GuildMember>interaction.member;
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

        await interaction.deleteReply();
        if (client.player.voiceChannel) {
            client.player.disconnect();

            if (client.player.queue.length > 0 || client.player.queue.current) {
                client.player.queue.clear();
            }

            client.currentlyPlaying = null;
        } else {
            const embed = new MessageEmbed()
                .setColor(bot.colors.UPSDELL_RED)
                .setDescription("❌ **I'm not connected to a VC!**");
            await interaction.deleteReply();
            await interaction.followUp({ embeds: [embed], ephemeral: true });
        }
    },
};
