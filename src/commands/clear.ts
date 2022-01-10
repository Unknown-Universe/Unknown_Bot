import { Category } from "../catagories";
import { Command } from "../command";

const clear: Command = {
    name: "clear",
    category: Category.Moderation,
    description: "Clears {number} of messages from a channel",
    useage: `purge {number}`,
    run: async (message, ...args) => {
        if (!message.member!.permissions.has("MANAGE_MESSAGES")) {
            await message.reply("You dont have permission to use this command");
            return;
        }
        if (!args.length) {
            await message.reply("Invalid Arguments");
            return;
        }
        const count = +args[0];
        if (!count || count < 2 || count > 100) {
            console.log(args);
            await message.reply("Please give a valid number");
            return;
        }
        if (message.channel.type !== "DM") {
            await message.channel.bulkDelete(count, true);
            const reply = await message.channel.send(
                `${count} messages deleted`
            );
            setTimeout(() => reply.delete().catch(() => {}), 5000);
        }
    },
};

export default clear;
