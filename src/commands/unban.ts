import { client } from "..";
import { Category } from "../catagories";
import { Command } from "../command";
import { embedColor } from "../utilities/constants";
import { fetchGuild } from "../utilities/database";
import { parseUserId } from "../utilities/parsers";

const unban: Command = {
    name: "unban",
    category: Category.Moderation,
    description:
        "Unbans a user with {User ID} from this server, requres ban_members permission",
    usage: `unban {User ID}`,
    aliases: [],
    run: async (message, ...args) => {
        if (!message.member!.permissions.has("BAN_MEMBERS")) {
            await message.reply("You dont have permission to use this command");
            return;
        }
        if (!args.length) {
            await message.reply("Invalid arguments");
            return;
        }

        const userID =
            parseUserId(args[0]) ?? args[0].match(/^(\d{17,19})$/)?.[1];

        const reason = args.slice(1).join(" ");

        if (reason.length > 512) {
            await message.reply("Reason to long");
            return;
        }

        if (!userID) {
            await message.reply("No user given");
            return;
        }
        try {
            await message.guild!.bans.fetch(userID);
        } catch {
            message.reply("User not banned");
            return;
        }
        await message.guild!.bans.remove(
            userID,
            reason.length ? reason : undefined
        );
        await message.reply(`User unbanned`);

        const guild = message.guild!;
        const guildInfo = await fetchGuild(guild.id);

        if (guildInfo.do_moderation_logging) {
            const logChannel = guild.channels.cache.get(
                guildInfo.message_logging_channel
            );

            if (logChannel!.isText()) {
                await logChannel.send({
                    embeds: [
                        {
                            color: embedColor,
                            title: `User Unbanned`,
                            fields: [
                                {
                                    name: "User Id:",
                                    value: userID,
                                },
                                {
                                    name: "Reason:",
                                    value: reason || "No Reason Given",
                                },
                                {
                                    name: "\u200b",
                                    value: "\u200b",
                                    inline: false,
                                },
                            ],
                            footer: {
                                text: "UnknownBot Moderation Logging",
                                iconURL:
                                    client.user!.avatarURL() ??
                                    "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
                            },
                        },
                    ],
                });
            }
        }
    },
};

export default unban;
