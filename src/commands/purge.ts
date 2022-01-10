import { Category } from "../catagories";
import { Command } from "../command";

const purge: Command = {
    name: "purge",
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
        if (!+args[0] || +args[0] < 1 || +args[0] > 99) {
            await message.reply("Please give a vaild number");
            return;
        }
        if (message.channel.type !== "DM") {
            await message.channel.bulkDelete(+args[0] + 1, true);
            const reply = await message.channel.send(
                `${args[0]} messages deleted`
            );
            setTimeout(() => reply.delete().catch(() => {}), 5000);
        }
    },
};

export default purge;
