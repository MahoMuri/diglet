import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, MessageEmbed } from "discord.js";
import { MusicClient } from "../../classes/MusicClient";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "join",
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Joins the VC."),
    description: "Joins the VC.",
    category: "music",
    adminOnly: false,
    usage: "/join",
    run: async (bot, interaction) => {
        const { guildId } = interaction;
        const member = <GuildMember>interaction.member;
        let client = bot.clients.get(guildId);

        if (!member.voice.channel) {
            const embed = new MessageEmbed()
                .setColor(bot.colors.UPSDELL_RED)
                .setDescription("❌ **You're not in a voice channel!**");
            await interaction.deleteReply();
            await interaction.followUp({ embeds: [embed], ephemeral: true });
            return;
        }

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

        if (
            client.player.voiceChannel !== member.voice.channelId &&
            client.player.queue.current
        ) {
            const embed = new MessageEmbed()
                .setColor(bot.colors.UPSDELL_RED)
                .setDescription("❌ **I'm being used in a different VC!**");
            await interaction.deleteReply();
            await interaction.followUp({ embeds: [embed], ephemeral: true });
            return;
        }

        client.join(interaction, member.voice.channelId);
    },
};
