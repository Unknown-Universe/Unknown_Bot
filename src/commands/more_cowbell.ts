import { Category } from "../types/catagories";
import { Command } from "../types/command";

const morecowbell: Command = {
    name: "morecowbell",
    category: Category.Random,
    description: ";)",
    usage: "Morecowbell",
    aliases: [],
    run: async (message) => {
        await message.reply(
            "https://tenor.com/view/cow-bell-fever-guees-what-gif-8044196"
        );
    },
};

export default morecowbell;
