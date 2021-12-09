import { parseUserId } from "..";
import { Category } from "../catagories";
import { Command } from "../command";

const ban: Command = {
    name: "ban",
    category: Category.Moderation,
    description:
        "Bans a user from this server, you must have the ban_members permission to run this command",
    useage: `ban {User} [reason]`,
    run: async (message, ...args) => {
        if (!message.member?.permissions.has("BAN_MEMBERS")) {
            await message.reply("You dont have permission to use this command");
            return;
        }
        if (!args.length) {
            await message.reply("No Arguments Given");
            return;
        }

        const userID = parseUserId(args[0]);
        const reason = args.slice(1).join(" ");
        if (userID === null) {
            await message.reply("No User Given");
            return;
        }
        const user = await message.guild!.members.fetch(userID);
        if (!user.bannable) {
            await message.reply("User is not bannable");
            return;
        }
        if (reason.length > 512) {
            await message.reply("Reason to Long");
            return;
        }

        if (
            message.guild!.me!.roles.highest.comparePositionTo(
                user.roles.highest
            ) <= 0
        ) {
            await message.reply("Unable to ban user with higher roles than me");
            return;
        }
        if (
            message.member.roles.highest.comparePositionTo(
                user.roles.highest
            ) <= 0
        ) {
            await message.reply(
                "You cant ban users with higher roles then you"
            );
            return;
        }
        try {
            await user.send(
                `You were banned from ${message.guild!.name} ${
                    reason.length ? `for ${reason}` : ""
                }`
            );
        } catch {}
        await user.ban({
            reason: reason.length ? reason : undefined,
        });
        await message.reply(`${user.user.tag} has been banned`);
    },
};

export default ban;
