import { parseRoleId } from "..";
import { Category } from "../catagories";
import { Command } from "../command";
import { fetchGuild } from "../database";

const AutoRole: Command = {
    name: "autorole",
    category: Category.Configuration,
    description:
        "Sets the default role to give everyone who joins the server, \n you can also set whether to set the role on join or not",
    useage: "autorole {Role} [True or False]",
    run: async (message, ...args) => {
        if (!message.member!.permissions.has("MANAGE_GUILD")) {
            await message.reply("You dont have permission to do this");
            return;
        }
        if (!args.length) {
            await message.reply("Usage: autorole {Role}");
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

        const guildInfo = await fetchGuild(message.guild!.id);
        await message.reply(`Set default role to ${role}`);
        guildInfo.autoRole = role;
        await guildInfo.save();
        if (!args[1]) {
            return;
        }

        if (args[1] === "true" || args[1] === "True") {
            guildInfo.setAutoRole = true;
            await guildInfo.save();
            await message.reply("Turned on autorole");
            return;
        } else if (args[1] === "false" || args[1] === "False") {
            guildInfo.setAutoRole = false;
            await guildInfo.save();
            await message.reply("Turned off autorole");
            return;
        }
        return;
    },
};

export default AutoRole;
