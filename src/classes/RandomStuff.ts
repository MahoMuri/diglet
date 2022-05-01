import axios, { AxiosInstance } from "axios";
import { Bot } from "../client";

interface AnimeOptions {
    query:
        | "alarm"
        | "amazing"
        | "ask"
        | "baka"
        | "bite"
        | "blush"
        | "blyat"
        | "boop"
        | "clap"
        | "coffee"
        | "confused"
        | "cry"
        | "cuddle"
        | "cute"
        | "dance"
        | "destroy"
        | "die"
        | "disappear"
        | "dodge"
        | "error"
        | "facedesk"
        | "facepalm"
        | "fbi"
        | "fight"
        | "happy"
        | "hide"
        | "highfive"
        | "hug"
        | "kill"
        | "kiss"
        | "laugh"
        | "lick"
        | "lonely"
        | "love"
        | "mad"
        | "money"
        | "nom"
        | "nosebleed"
        | "ok"
        | "party"
        | "pat"
        | "peek"
        | "poke"
        | "pout"
        | "protect"
        | "puke"
        | "punch"
        | "purr"
        | "pusheen"
        | "run"
        | "salute"
        | "scared"
        | "scream"
        | "shame"
        | "shocked"
        | "shoot"
        | "shrug"
        | "sip"
        | "sit"
        | "slap"
        | "sleepy"
        | "smile"
        | "smoke"
        | "smug"
        | "spin"
        | "stare"
        | "stomp"
        | "tickle"
        | "trap"
        | "triggered"
        | "uwu"
        | "wasted"
        | "wave"
        | "wiggle"
        | "wink"
        | "yeet";
}

interface NekosLifeOptions {
    type:
        | "4k"
        | "ass"
        | "bj"
        | "cum"
        | "feet"
        | "hentai"
        | "wallpapers"
        | "spank"
        | "gasm"
        | "lesbian"
        | "lewd"
        | "pussy"
        | "boobs";
}

export class RandomStuff {
    public bot: Bot;

    private nekosInstance: AxiosInstance;

    private kawaiiInstance: AxiosInstance;

    constructor(bot: Bot) {
        this.bot = bot;

        this.nekosInstance = axios.create({
            baseURL: "http://api.nekos.fun:8080/api",
        });

        this.kawaiiInstance = axios.create({
            baseURL: "https://kawaii.red/api/gif",
        });
    }

    async anime(options: AnimeOptions) {
        const response = await this.kawaiiInstance.get(
            `/${options.query}/token=${process.env.KAWAII_TOKEN}`
        );

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    }

    async nekos(options: NekosLifeOptions) {
        const { data } = await this.nekosInstance(`/${options.type}`);

        return data;
    }
}
