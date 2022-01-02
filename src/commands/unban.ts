import { Category } from "../catagories";
import { Command } from "../command";
import { parseUserId } from "../utilities/parsers";

const unban: Command = {
    name: "unban",
    category: Category.Moderation,
    description:
        "Unbans a user with {User ID} from this server, requres ban_members permission",
    useage: `unban {User ID}`,
    run: async (message, ...args) => {
        if (!message.member!.permissions.has("BAN_MEMBERS")) {
            await message.reply("You dont have permission to use this command");
            return;
        }
        if (!args.length) {
            await message.reply("No Arguments Given");
            return;
        }

        const userID =
            parseUserId(args[0]) ?? args[0].match(/^(\d{17,19})$/)?.[1];

        const reason = args.slice(1).join(" ");

        if (reason.length > 512) {
            await message.reply("Reason to Long");
            return;
        }

        if (!userID) {
            await message.reply("No User Given");
            return;
        }
        try {
            await message.guild!.bans.fetch(userID);
        } catch {
            message.reply("Member not banned");
            return;
        }
        await message.guild!.bans.remove(
            userID,
            reason.length ? reason : undefined
        );
        await message.reply(`User Unbanned`);
    },
};

export default unban;
