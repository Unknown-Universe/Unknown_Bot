import { TextChannel } from "discord.js";
import { Category } from "../catagories";
import { Command } from "../command";
import { invalidUsageMessage, permissionMessage } from "../utilities/constants";

const clear: Command = {
    name: "clear",
    category: Category.Moderation,
    description: "Deletes messages in bulk.",
    usage: `<number>`,
    aliases: ["purge", "bulkdelete"],
    run: async (message, numberText) => {
        if (!message.member!.permissions.has("MANAGE_MESSAGES"))
            return await message.reply(permissionMessage);

        if (!numberText) return await message.reply(invalidUsageMessage);

        const number = +numberText;
        if (isNaN(number) || number < 2 || number > 100)
            return await message.reply("Please give a valid number");
        await (message.channel as TextChannel).bulkDelete(number, true);
        const reply = await message.channel.send(
            `Deleted ${number} messages from this channel.`
        );
        setTimeout(() => reply.delete().catch(() => {}), 5000);
    },
};

export default clear;
