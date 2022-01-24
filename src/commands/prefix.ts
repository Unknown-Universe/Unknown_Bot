import { Category } from "../types/catagories";
import { Command } from "../types/command";
import { permissionMessage } from "../utilities/constants";
import { db } from "../utilities/database";

const prefix: Command = {
    name: "prefix",
    category: Category.Configuration,
    description: "Change the prefix for your server",
    usage: "<new prefix>",
    aliases: [],
    run: async (message, ...args) => {
        const guild = message.guild!;

        if (!message.member!.permissions.has("MANAGE_GUILD")) {
            await message.reply(permissionMessage);
            return;
        }
        if (!args.length) {
            await message.reply("Please give a valid prefix");
            return;
        }
        const prefix = args[0];

        if (!prefix.length || prefix.length > 5) {
            await message.reply("Please give a valid prefix");
            return;
        }

        await db.execute("UPDATE `guilds` SET `prefix` = ? WHERE `id` = ?", [
            prefix,
            message.guildId,
        ]);
        await message.reply(`Prefix changed to: ${prefix}`);
    },
};

export default prefix;
