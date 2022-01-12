import { Category } from "../catagories";
import { Command } from "../command";

const cowabunga: Command = {
    name: "cowabunga",
    category: Category.Random,
    description: ";)",
    usage: "cowabunga",
    aliases: [],
    run: async (message) => {
        await message.reply("Deez nuts");
    },
};

export default cowabunga;
