import mongoose, { model, Schema } from "mongoose";

mongoose.connect("mongodb://localhost:27017/unknownbot");

interface Reaction {
    roleID: string;
    emojiID: string;
    messageID: string;
}

export const ReactionModel = model<Reaction>(
    "reaction",
    new Schema<Reaction>({
        roleID: { type: String, required: true },
        emojiID: { type: String, required: true },
        messageID: { type: String, required: true },
    })
);
