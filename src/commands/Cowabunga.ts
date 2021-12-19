import { Category } from "../catagories";
import { Command } from "../command";

const cowabunga: Command = {
    name: "cowabunga",
    category: Category.Random,
    description: ";)",
    useage: "cowabunga",
    run: async (message, ...args) => {
        await message.reply("Deez nuts");
    },
};

export default cowabunga;
