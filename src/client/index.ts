import consola, { Consola } from "consola";
import { Client, Collection, Guild, Intents } from "discord.js";
import { readdirSync } from "fs";
import { connect } from "mongoose";
import { table, getBorderCharacters } from "table";
import path from "path";
import { Manager } from "erela.js";
import Spotify from "erela.js-spotify";
import { Cache } from "../interfaces/Cache";
import { Command } from "../interfaces/Command";
import { getEnvironmentConfig } from "../utils/Environment";
import { MusicClient } from "../classes/MusicClient";
import { Colors } from "../interfaces/Colors";
import { RandomStuff } from "../classes/RandomStuff";

export class Bot extends Client {
    public categories = readdirSync(path.join(__dirname, "..", "commands"));

    public commands: Collection<string, Command> = new Collection();

    public aliases: Collection<string, Command> = new Collection();

    public events: Collection<string, Command> = new Collection();

    public clients: Collection<string, MusicClient> = new Collection();

    public cache: Cache = {
        guildConfigs: new Collection(),
    };

    public config = getEnvironmentConfig();

    public consola: Consola;

    public colors = Colors;

    public mainGuild: Guild;

    public erela: Manager;

    public randomStuff: RandomStuff;

    constructor() {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_VOICE_STATES,
                Intents.FLAGS.GUILD_PRESENCES,
            ],
            allowedMentions: {
                parse: ["roles", "users"],
            },
        });
    }

    public async init() {
        await this.login(this.config.token);

        consola.wrapConsole();

        this.consola = consola.withScope(this.user.username);

        this.randomStuff = new RandomStuff(this);

        connect(this.config.mongodbURI).then((mongodb) => {
            this.consola.success(
                `Successfully connected to ${mongodb.connection.name}`
            );
        });

        this.erela = new Manager({
            nodes: this.config.nodes,
            clientName: this.user.username,
            plugins: [
                new Spotify({
                    clientID: process.env.SPOTIFY_CLIENT_ID,
                    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
                }),
            ],
            autoPlay: true,
            send: (guildId, payload) => {
                const guild = this.guilds.cache.get(guildId);
                if (guild) {
                    guild.shard.send(payload);
                }
            },
        });

        this.on("raw", (d) => this.erela.updateVoiceState(d));

        this.erela.on("nodeConnect", (node) => {
            this.consola.success(
                `Successfully connected to ${node.options.identifier}`
            );
        });

        this.erela.on("nodeError", (node, err) => {
            this.consola.error(`Error on ${node.options.identifier}.`, err);
        });

        // Command registry
        const cmdTable = [];
        const commandsPath = path.join(__dirname, "..", "commands");
        this.categories.forEach((dir) => {
            const commands = readdirSync(`${commandsPath}/${dir}`).filter(
                (file) => file.endsWith(".ts")
            );

            commands.forEach((file) => {
                try {
                    const {
                        command,
                    } = require(`${commandsPath}/${dir}/${file}`);
                    this.commands.set(command.name, command);
                    cmdTable.push([file, "Loaded"]);
                } catch (error) {
                    cmdTable.push([file, `${error.message}`]);
                }
            });
        });

        // Event registry
        const eventTable = [];
        const eventsPath = path.join(__dirname, "..", "events");
        readdirSync(eventsPath).forEach((file) => {
            try {
                const { event } = require(`${eventsPath}/${file}`);
                this.events.set(event.name, event);
                this.on(event.name, event.run.bind(null, this));

                eventTable.push([file, "Loaded"]);
            } catch (error) {
                eventTable.push([file, `${error.message}`]);
            }
        });
        this.consola.log(
            `${table(cmdTable, {
                border: getBorderCharacters("norc"),
                header: {
                    alignment: "center",
                    content: "Commands",
                },
            })}${table(eventTable, {
                border: getBorderCharacters("norc"),
                header: {
                    alignment: "center",
                    content: "Events",
                },
            })}`
        );
    }
}
