import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { readdirSync } from "fs";
import path from "path";
import { Event } from "../interfaces/Event";
import GuildModel from "../models/GuildModel";

export const event: Event = {
    name: "ready",
    run: async (bot) => {
        bot.mainGuild = bot.guilds.cache.get(process.env.GUILD_ID);

        bot.erela.init(bot.user.id);
        // Slashcommand registry
        const commands = [];
        const clientId = bot.application.id;
        const hiddenCommands = ["test"];

        bot.categories.forEach((dir) => {
            const commandFiles = readdirSync(
                path.resolve(`src/commands/${dir}`)
            ).filter((file) => file.endsWith(".ts"));
            commandFiles.forEach((file) => {
                const { command: cmd } = require(`../commands/${dir}/${file}`);
                if (bot.config.mode === "production") {
                    if (cmd.data && !hiddenCommands.includes(cmd.name)) {
                        commands.push(cmd.data.toJSON());
                    }
                    return;
                }
                if (cmd.data) {
                    commands.push(cmd.data.toJSON());
                }
            });
        });

        try {
            const guildCache = bot.guilds.cache.map(async (guild) => {
                const guildId = guild.id;
                let guildSettings = await GuildModel.findOne({
                    guildId,
                });

                if (!guildSettings) {
                    try {
                        guildSettings = await GuildModel.create({
                            guildId,
                        });

                        bot.consola.success(`Joined ${guild.name}!`);
                    } catch (error) {
                        bot.consola.error(error);
                    }
                }

                if (guildSettings) {
                    bot.cache.guildConfigs.set(guildId, guildSettings);
                }
            });

            await Promise.all([guildCache].map(Promise.all.bind(Promise)));
        } catch (error) {
            bot.consola.error(error);
        }

        // Slash command registration
        const TOKEN = bot.config.token;
        const rest = new REST({ version: "9" }).setToken(TOKEN);

        try {
            bot.consola.info("Started loading slash commands...");
            await rest.put(
                Routes.applicationGuildCommands(clientId, process.env.GUILD_ID),
                {
                    body: commands,
                }
            );
            bot.consola.info("============================");
            bot.consola.success("Guild slash commands loaded!");
            bot.consola.info("============================");
        } catch (error) {
            bot.consola.error(error);
        }

        bot.consola.success(`${bot.user.username} is online!`);
    },
};
