import { Category } from "../catagories";
import { Command } from "../command";

const evaluate: Command = {
    name: "eval",
    category: Category.Restricted,
    description: "",
    usage: "",
    aliases: [],
    run: async (message, ...args) => {
        if (
            !(
                message.member!.user.id === "863935113623633941" ||
                message.member!.user.id === "239457433938821121"
            )
        ) {
            return;
        }
        await message.reply("" + (await eval(args.join(" "))));
    },
};

export default evaluate;
