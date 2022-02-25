import axios, { AxiosInstance } from "axios";
import { Bot } from "../client";

interface JokeOptions {
    type: string;
    blacklist?: string;
}

interface AnimeOptions {
    type:
        | "happy"
        | "hi"
        | "kiss"
        | "hug"
        | "punch"
        | "pat"
        | "slap"
        | "nervous"
        | "run"
        | "cry";
    limit: number;
}

interface AnimalOptions {
    type: "dog" | "cat" | "wolf" | "fox";
    limit: number;
}

interface NekosLifeOptions {
    type:
        | "solog"
        | "smug"
        | "feet"
        | "smallboobs"
        | "lewdkemo"
        | "woof"
        | "gasm"
        | "solo"
        | "8ball"
        | "goose"
        | "cuddle"
        | "avatar"
        | "cum"
        | "slap"
        | "les"
        | "v3"
        | "erokemo"
        | "bj"
        | "pwankg"
        | "nekoapi_v3.1"
        | "ero"
        | "hololewd"
        | "pat"
        | "gecg"
        | "holo"
        | "poke"
        | "feed"
        | "fox_girl"
        | "tits"
        | "nsfw_neko_gif"
        | "eroyuri"
        | "holoero"
        | "pussy"
        | "Random_hentai_gif"
        | "lizard"
        | "yuri"
        | "keta"
        | "neko"
        | "hentai"
        | "feetg"
        | "eron"
        | "erok"
        | "baka"
        | "kemonomimi"
        | "hug"
        | "cum_jpg"
        | "nsfw_avatar"
        | "erofeet"
        | "meow"
        | "kiss"
        | "wallpaper"
        | "tickle"
        | "blowjob"
        | "spank"
        | "kuni"
        | "classic"
        | "waifu"
        | "femdom"
        | "boobs"
        | "trap"
        | "lewd"
        | "pussy_jpg"
        | "anal"
        | "futanari"
        | "ngif"
        | "lewdk";
}

export class RandomStuff {
    public bot: Bot;

    private randStuffInstance: AxiosInstance;

    private nekosInstance: AxiosInstance;

    constructor(bot: Bot) {
        this.bot = bot;

        this.randStuffInstance = axios.create({
            baseURL: "https://random-stuff-api.p.rapidapi.com",
            headers: {
                authorization: process.env.RS_AUTH,
                "x-rapidapi-host": "random-stuff-api.p.rapidapi.com",
                "x-rapidapi-key": process.env.RAPID_API_KEY,
            },
        });

        this.nekosInstance = axios.create({
            baseURL: "https://nekos.life/api/v2",
        });
    }

    async joke(options: JokeOptions) {
        const response = await this.randStuffInstance.get("/joke", {
            params: options,
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    }

    async anime(options: AnimeOptions) {
        const response = await this.randStuffInstance.get(
            `/anime/${options.type}`,
            {
                params: { limit: options.limit },
            }
        );

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    }

    async animal(options: AnimalOptions) {
        const response = await this.randStuffInstance.get(
            `/animal/${options.type}`,
            {
                params: { limit: options.limit },
            }
        );

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    }

    async nekos(options: NekosLifeOptions) {
        const { data } = await this.nekosInstance(`/img/${options.type}`);

        return data;
    }
}
