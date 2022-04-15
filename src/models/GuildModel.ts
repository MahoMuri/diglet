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
        default: null,
        required: true,
    },
    voiceChannel: {
        type: String,
        default: null,
        required: true,
    },
    maxWarns: {
        type: Number,
        default: 10,
    },
    warns: {
        type: SchemaTypes.Map,
        default: null,
    },
});

export default model<GuildConfig>("guildconfigs", GuildSchema);
