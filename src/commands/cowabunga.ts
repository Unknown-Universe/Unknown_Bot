import { Category } from "../types/catagories";
import { Command } from "../types/command";

const cowabunga: Command = {
    name: "cowabunga",
    category: Category.Random,
    description: ";)",
    usage: "",
    aliases: [],
    run: async (message) => {
        await message.reply("Deez nuts");
    },
};

export default cowabunga;
