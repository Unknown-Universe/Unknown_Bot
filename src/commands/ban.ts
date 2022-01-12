import { GuildMember } from "discord.js";
import { Category } from "../catagories";
import { Command } from "../command";
import {
    invalidMemberMessage,
    invalidUsageMessage,
    permissionMessage,
} from "../utilities/constants";
import { parseUserId } from "../utilities/parsers";

const ban: Command = {
    name: "ban",
    category: Category.Moderation,
    description: "Bans a member from this server",
    usage: `<member> [...reason]`,
    aliases: [],
    run: async (message, mention, ...args) => {
        if (!message.member!.permissions.has("BAN_MEMBERS"))
            return await message.reply(permissionMessage);

        if (!mention) return await message.reply(invalidUsageMessage);

        const userId = parseUserId(mention);
        if (!userId) return await message.reply(invalidMemberMessage);

        const reason = args.join(" ");

        let member: GuildMember;
        try {
            member = await message.guild!.members.fetch(userId);
        } catch {
            return await message.reply(invalidMemberMessage);
        }

        if (!member.bannable)
            return await message.reply("That member is not bannable.");

        if (reason.length > 512)
            return await message.reply("That reason is too long.");

        if (
            message.member!.roles.highest.comparePositionTo(
                member.roles.highest
            ) <= 0
        )
            return await message.reply(
                "You cannot ban members with higher roles."
            );

        if (
            message.guild!.me!.roles.highest.comparePositionTo(
                member.roles.highest
            ) <= 0
        )
            return await message.reply(
                "Cannot ban members with higher roles than the bot."
            );

        try {
            await member.send(
                `You were banned from ${message.guild!.name}${
                    reason ? ` for ${reason}` : ""
                }.`
            );
        } catch {
            return await message.reply("Could not ban that member.");
        }

        await member.ban({
            reason: reason || undefined,
        });

        await message.reply(
            `${member.user.tag} has been banned${
                reason ? ` for ${reason}` : ""
            }.`
        );
    },
};

export default ban;
