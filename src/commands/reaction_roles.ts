import { Emoji, Role } from "discord.js";
import { Category } from "../types/catagories";
import { Command } from "../types/command";
import {
    embedColor,
    invalidRoleMessage,
    invalidUsageMessage,
    permissionMessage,
} from "../utilities/constants";
import { db } from "../utilities/database";
import { parseRoleId } from "../utilities/parsers";

const reactionRoles: Command = {
    name: "reactionroles",
    category: Category.Configuration,
    description: "Makes a reaction role menu",
    usage: "",
    aliases: ["rr"],
    run: async (message, ...args) => {
        if (!message.member!.permissions.has("MANAGE_ROLES")) {
            await message.reply(permissionMessage);
            return;
        }
        if (!args.length) {
            await message.reply(invalidUsageMessage);
            return;
        }
        const roles: Role[] = [];
        for (const role of args) {
            const parsedRole = parseRoleId(role);
            if (!parsedRole) {
                await message.reply(`${role} is not a valid role`);
                return;
            }
            try {
                const returnRole = await message.guild!.roles.fetch(parsedRole);
                if (!returnRole) {
                    await message.reply(invalidRoleMessage);
                    return;
                }
                roles.push(returnRole);
            } catch {
                await message.reply(invalidRoleMessage);
            }
        }

        const reactions: Emoji[] = [];
        const m = await message.channel.send(".");

        for (const role of roles) {
            await m.edit(`React with the emoji for ${role}`);
            try {
                const reaction = await m.awaitReactions({
                    filter: (_, user) => user.id === message.author.id,
                    time: 120000,
                    max: 1,
                    errors: ["time"],
                });
                reactions.push(reaction.first()!.emoji);
            } catch {
                await message.reply("Timed out");
                return;
            }
        }
        await m.delete();

        let i = 0;
        const reactionMessage = await message.channel.send({
            embeds: [
                {
                    color: embedColor,
                    fields: roles.map((role) => {
                        const emoji = reactions[i];
                        i++;
                        return {
                            name: `${role.name}`,
                            value: `${emoji}`,
                        };
                    }),
                },
            ],
        });
        for (const [index, emoji] of reactions.entries()) {
            await reactionMessage.react(emoji.id ?? emoji.name!);
            await db.execute(
                "INSERT INTO `reaction_roles` (`emoji_id`, `role_id`, `message_id`) VALUES (?, ?, ?)",
                [emoji.id ?? emoji.name, roles[index].id, reactionMessage.id]
            );
        }
        await message.delete();
    },
};

export default reactionRoles;
