import { Category } from "../catagories";
import { Command } from "../command";
import {
    invalidRoleMessage,
    invalidUsageMessage,
    permissionMessage,
} from "../utilities/constants";
import { db } from "../utilities/database";
import { parseRoleId } from "../utilities/parsers";

const autoRole: Command = {
    name: "autorole",
    category: Category.Configuration,
    description: "Manages the role to add to new users.",
    usage: "<role>",
    aliases: ["joinrole", "auto"],

    run: async (message, value) => {
        if (!message.member!.permissions.has("MANAGE_GUILD"))
            return await message.reply(permissionMessage);

        if (!value) return await message.reply(invalidUsageMessage);

        const role = parseRoleId(value);
        if (!role) return await message.reply(invalidRoleMessage);

        const roles = await message.guild!.roles.fetch();
        if (!roles.has(role)) return await message.reply(invalidRoleMessage);

        await db.execute("UPDATE `guilds` SET `auto_role` = ? WHERE `id` = ?", [
            role,
            message.guildId,
        ]);

        await message.reply(`Set the auto role to <@&${role}>.`);
    },
};

export default autoRole;
