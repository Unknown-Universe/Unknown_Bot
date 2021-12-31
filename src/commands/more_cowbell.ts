import { Category } from "../catagories";
import { Command } from "../command";

const morecowbell: Command = {
    name: "morecowbell",
    category: Category.Random,
    description: ";)",
    useage: "Morecowbell",
    run: async (message, ...args) => {
        await message.reply(
            "https://tenor.com/view/cow-bell-fever-guees-what-gif-8044196"
        );
    },
};

export default morecowbell;
