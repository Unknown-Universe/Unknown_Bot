import { Category } from "../catagories";
import { Command } from "../command";

const evaluate: Command = {
    name: "eval",
    category: Category.Restricted,
    description: "",
    useage: "",
    run: async (message, ...args) => {
        if (message.member!.user.id !== "863935113623633941") {
            return;
        }
        await message.reply("" + (await eval(args.join(" "))));
    },
};

export default evaluate;
