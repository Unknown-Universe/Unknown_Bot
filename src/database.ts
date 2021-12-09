import mongoose, { model, Schema } from "mongoose";

mongoose.connect("mongodb://localhost:27017/unknownbot");

interface Guild {
    id: string;
    prefix: string;
}

export const GuildModel = model<Guild>(
    "guild",
    new Schema<Guild>({
        id: { type: String, required: true },
        prefix: { type: String, default: "~" },
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
