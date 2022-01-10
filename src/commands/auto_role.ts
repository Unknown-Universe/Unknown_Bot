import { Category } from "../catagories";
import { Command } from "../command";
import { db } from "../utilities/database";
import { parseRoleId } from "../utilities/parsers";

const AutoRole: Command = {
    name: "autorole",
    category: Category.Configuration,
    description:
        "Sets the default role to give everyone who joins the server, \n you can also set whether to set the role on join or not",
    useage: "autorole {Role} [True or False]",
    run: async (message, ...args) => {
        if (!message.member!.permissions.has("MANAGE_GUILD")) {
            await message.reply("You dont have permission to use this command");
            return;
        }
        if (!args.length) {
            await message.reply("Invalid Arguments");
            return;
        }

        if (args[0] === "true" || args[0] === "True") {
            await db.execute(
                "UPDATE `guilds` SET `set_auto_role` = 1 WHERE `id` = ?",
                [message.guildId]
            );
            await message.reply("Turned on autorole");
            return;
        } else if (args[0] === "false" || args[0] === "False") {
            await db.execute(
                "UPDATE `guilds` SET `set_auto_role` = 0 WHERE `id` = ?",
                [message.guildId]
            );
            await message.reply("Turned off autorole");
            return;
        }

        const role = parseRoleId(args[0]);

        if (!role) {
            await message.reply("Invalid Role");
            return;
        }
        if (!(await message.guild!.roles.fetch()).has(role)) {
            await message.reply("Invalid Role");
            return;
        }

        await message.reply(`Set default role to <@&${role}>`);
        await db.execute("UPDATE `guilds` SET `auto_role` = ? WHERE `id` = ?", [
            role,
            message.guildId,
        ]);
    },
};

export default AutoRole;
