import { Guild } from "discord.js";
import { Event } from "../interfaces/Event";
import GuildModel from "../models/GuildModel";

export const event: Event = {
    name: "guildDelete",
    run: async (bot, guild: Guild) => {
        await GuildModel.findOneAndDelete({ guildId: guild.id });

        bot.consola.info(`Left ${guild.name}!`);
    },
};
