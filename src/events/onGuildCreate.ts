import { Guild } from "discord.js";
import { Event } from "../interfaces/Event";
import GuildModel from "../models/GuildModel";

export const event: Event = {
    name: "guildCreate",
    run: async (bot, guild: Guild) => {
        let guildConfig = await GuildModel.findOne({
            guildId: guild.id,
        });

        if (!guildConfig) {
            guildConfig = await GuildModel.create({
                guildId: guild.id,
                prefix: bot.config.prefix,
            });
        }

        bot.consola.info(`Joined ${guild.name}!`);
    },
};
