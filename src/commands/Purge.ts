import { prefix } from "..";
import { Category } from "../catagories";
import { Command } from "../command";

const purge: Command = {
    name: "purge",
    category: Category.Moderation,
    description: "Clears {number} of messages from a channel",
    useage: `${prefix}purge {number}`,
    run: async (message, ...args) => {
        if (!message.member?.permissions.has("MANAGE_MESSAGES")) {
            await message.reply("You dont have permission to use this");
            return;
        }
        if (!args.length) {
            await message.reply("No Arguments Given");
            return;
        }
        if (!+args[0]) {
            console.log(args);
            await message.reply("Please give a vaild number");
            return;
        }
        if (message.channel.type !== "DM") {
            message.channel.bulkDelete(+args[0], true);
        }
    },
};

export default purge;
