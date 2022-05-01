import { bold, SlashCommandBuilder } from "@discordjs/builders";
import { stripIndents } from "common-tags";
import { GuildMember, MessageEmbed } from "discord.js";
import ms from "ms";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "warn",
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warns a user")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to warn")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("The reason for the warn")
                .setRequired(true)
        ),
    description: "Warns a user",
    category: "admin",
    adminOnly: true,
    usage: "/warn <user> [reason]",
    run: async (bot, interaction) => {
        const toWarn = <GuildMember>interaction.options.getMember("user");
        const reason = interaction.options.getString("reason");

        const guildConfig = bot.cache.guildConfigs.get(interaction.guildId);

        let userWarns = guildConfig.warns.get(toWarn.id);

        if (!userWarns) {
            userWarns = 1;
        } else {
            userWarns += 1;
        }

        bot.consola.log(userWarns);

        if (userWarns === guildConfig.maxWarns) {
            toWarn
                .timeout(ms("15m"), "User reached maximum warns!")
                .then((member) => {
                    const embed = new MessageEmbed()
                        .setTitle("Timeout!")
                        .setColor(bot.colors.UPSDELL_RED)
                        .setDescription(
                            `You have been warned ${userWarns} times therefore I have timed you out for 15mins.`
                        );
                    member.send({ embeds: [embed] });
                });
            return;
        }

        const embed = new MessageEmbed()
            .setTitle("You have been warned!")
            .setColor(bot.colors.DEEP_SAFFRON)
            .setDescription(
                stripIndents`${toWarn}, you have been warned for: ${bold(
                    reason
                )}
                
                You have ${userWarns} warns!`
            );
        interaction.editReply({ content: `${toWarn}`, embeds: [embed] });

        guildConfig.warns.set(toWarn.id, userWarns);
        guildConfig.markModified("warns");
        guildConfig.save();
    },
};
