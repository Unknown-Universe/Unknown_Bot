import mongoose, { model, Schema } from "mongoose";

mongoose.connect("mongodb://localhost:27017/unknownbot");

interface User {
    id: string;
    balance: number;
}

export const UserModel = model<User>(
    "user",
    new Schema<User>({
        id: { type: String, required: true },
        balance: { type: Number, default: 0 },
    })
);

export async function fetchUser(userID: string) {
    let user = await UserModel.findOne({ id: userID });
    if (user === null) {
        user = new UserModel();
        user.id = userID;
        await user.save();
    }
    return user;
}
