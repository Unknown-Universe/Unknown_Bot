import { client } from "..";
import { Category } from "../types/catagories";
import { Command } from "../types/command";

const ping: Command = {
    name: "ping",
    category: Category.Utilities,
    description: "Gets the current latincy of the bot",
    usage: "",
    aliases: [],
    run: async (message) => {
        const yourping = Date.now() - message.createdTimestamp;
        const botping = Math.round(client.ws.ping);

        await message.reply(
            `Your ping is: ${yourping} \nBots ping is: ${botping}`
        );
    },
};

export default ping;
