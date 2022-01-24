import { Category } from "../types/catagories";
import { Command } from "../types/command";
import {
    invalidRoleMessage,
    invalidUsageMessage,
    permissionMessage,
} from "../utilities/constants";
import { parseRoleId } from "../utilities/parsers";

const massnick: Command = {
    name: "massnick",
    category: Category.Moderation,
    description:
        "Sets nick of everyone with a role,\nYou can use `{user}` to insert the orignials users name, will not change a nick if the name is too long",
    usage: "<role> <name>",
    aliases: ["setnick", "nickrole"],
    run: async (message, ...args) => {
        if (!message.member!.permissions.has("MANAGE_NICKNAMES")) {
            await message.reply(permissionMessage);
            return;
        }

        if (args.length < 2) {
            await message.reply(invalidUsageMessage);
            return;
        }

        const role = parseRoleId(args.shift()!);
        if (!role) {
            await message.reply(invalidRoleMessage);
            return;
        }
        const response = await message.reply("This might take a while");

        const members = await message.guild!.members.fetch();

        for (const member of members
            .filter((member) => member.roles.cache.has(role))
            .values()) {
            const newNick = args
                .join(" ")
                .replaceAll("{user}", member.user.username);
            if (newNick.length > 32) {
                continue;
            }
            try {
                await member.setNickname(newNick);
            } catch {}
        }
        await response.edit("Done!");
    },
};

export default massnick;
