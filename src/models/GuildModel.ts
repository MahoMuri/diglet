import { model, Schema, SchemaTypes } from "mongoose";
import { GuildConfig } from "../interfaces/GuildConfig";

const GuildSchema = new Schema<GuildConfig>({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    textChannel: {
        type: String,
        default: "",
    },
    voiceChannel: {
        type: String,
        default: "",
    },
    maxWarns: {
        type: Number,
        default: 10,
    },
    warns: {
        type: SchemaTypes.Map,
        default: new Map(),
    },
});

export default model<GuildConfig>("guildconfigs", GuildSchema);
