import { Category } from "../catagories";
import { Command } from "../command";
import { fetchUser } from "../utilities/database";

const balance: Command = {
    name: "balance",
    category: Category.Entertainment,
    description: "Shows your balance.",
    usage: "",
    aliases: ["bal", "money", "cash"],

    run: async (message) => {
        const data = await fetchUser(message.author.id);
        await message.reply(`Your balance is ${data.balance}.`);
    },
};

export default balance;
