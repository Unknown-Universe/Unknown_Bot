import { Category } from "../types/catagories";
import { Command } from "../types/command";

const evaluate: Command = {
    name: "eval",
    category: Category.Restricted,
    description: "",
    usage: "",
    aliases: [],
    run: async (message, ...args) => {
        await message.reply("" + (await eval(args.join(" "))));
    },
};

export default evaluate;
