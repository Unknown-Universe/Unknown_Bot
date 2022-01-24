import { GuildMember } from "discord.js";
import { client } from "..";
import { Category } from "../types/catagories";
import { Command } from "../types/command";
import {
    embedColor,
    invalidUsageMessage,
    permissionMessage,
} from "../utilities/constants";
import { fetchGuild } from "../utilities/database";
import { parseUserId } from "../utilities/parsers";

const unmute: Command = {
    name: "unmute",
    category: Category.Moderation,
    description: "Unmutes a muted user",
    usage: "",
    aliases: [],
    run: async (message, ...args) => {
        if (!message.member!.permissions.has("MODERATE_MEMBERS")) {
            await message.reply(permissionMessage);
            return;
        }
        if (!args.length) {
            await message.reply(invalidUsageMessage);
            return;
        }

        const userID = parseUserId(args[0]);
        if (!userID) {
            await message.reply("Please give a valid member");
            return;
        }

        let member: GuildMember;

        try {
            member = await message.guild!.members.fetch(userID);
        } catch {
            await message.reply("User not in this server");
            return;
        }

        if (!member.isCommunicationDisabled()) {
            await message.reply("User not muted");
            return;
        }

        const reason = args.slice(1).join(" ");

        if (reason.length > 512) {
            await message.reply("Reason to Long");
            return;
        }

        await member.timeout(null, reason || undefined);
        await message.reply(`${member} was unmuted`);

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
                            author: {
                                name: member.user.username,
                                iconURL:
                                    member.avatarURL() ??
                                    "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
                            },
                            title: `User Unmuted`,
                            fields: [
                                {
                                    name: "User Id:",
                                    value: member.user.id,
                                },
                                {
                                    name: "Reason:",
                                    value: reason.length
                                        ? reason
                                        : "No Reason Given",
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

export default unmute;
