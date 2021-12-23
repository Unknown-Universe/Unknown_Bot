import mongoose, { model, Schema } from "mongoose";

mongoose.connect("mongodb://localhost:27017/unknownbot");

interface Guild {
    id: string;
    prefix: string;
    sendWelcome: boolean;
    welcomeChannel: string;
    welcomeMessage: string;
    autoRole: string;
    setAutoRole: boolean;
    filter: string[];
    doFilter: boolean;
}

export const GuildModel = model<Guild>(
    "guild",
    new Schema<Guild>({
        id: { type: String, required: true },
        prefix: { type: String, default: "~" },
        sendWelcome: { type: Boolean, default: false },
        welcomeChannel: { type: String },
        welcomeMessage: {
            type: String,
            default: "Welcome {user} to the server",
        },
        autoRole: { type: String },
        setAutoRole: { type: Boolean, default: false },
        filter: { type: [String] },
        doFilter: { type: Boolean, default: false },
    })
);

export async function fetchGuild(guildID: string) {
    let guild = await GuildModel.findOne({ id: guildID });
    if (guild === null) {
        guild = new GuildModel();
        guild.id = guildID;
        await guild.save();
    }
    return guild;
}
