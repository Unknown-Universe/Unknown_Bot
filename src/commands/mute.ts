import ms from "ms";
import { client } from "..";
import { Category } from "../catagories";
import { Command } from "../command";
import { embedColor } from "../utilities/constants";
import { fetchGuild } from "../utilities/database";
import { parseUserId } from "../utilities/parsers";

const mute: Command = {
    name: "mute",
    category: Category.Moderation,
    description: "Used to mute a member for a time in minutes",
    usage: "mute {user} {time} [reason]",
    aliases: ["timeout"],
    run: async (message, ...args) => {
        if (!message.member!.permissions.has("MODERATE_MEMBERS")) {
            await message.reply("You dont have permission to use this command");
            return;
        }

        if (args.length < 2) {
            await message.reply("Invalid arguments");
            return;
        }

        const userID = parseUserId(args.shift()!);

        const time = ms(args[0]);
        const reason = args.slice(1).join(" ");

        if (userID === null) {
            await message.reply("No user given");
            return;
        }

        if (time < 1) {
            await message.reply("Please give a time greater then zero");
            return;
        }

        const user = await message.guild!.members.fetch(userID);

        if (!user.moderatable) {
            await message.reply("User is not able to be muted");
            return;
        }
        if (reason.length > 512) {
            await message.reply("Reason to long");
            return;
        }

        if (
            message.guild!.me!.roles.highest.comparePositionTo(
                user.roles.highest
            ) <= 0
        ) {
            await message.reply(
                "Unable to mute user with higher roles than me"
            );
            return;
        }
        if (
            message.member!.roles.highest.comparePositionTo(
                user.roles.highest
            ) <= 0
        ) {
            await message.reply(
                "You cant mute users with higher roles then you"
            );
            return;
        }
        try {
            await user.send(
                `You were muted for ${ms(time, { long: true })} in ${
                    message.guild!.name
                } ${reason.length ? `for ${reason}` : ""}`
            );
        } catch {}
        await user.timeout(time, reason || undefined);
        await message.reply(`Muted ${user} for ${ms(time, { long: true })}`);

        const guild = message.guild!;
        const guildInfo = await fetchGuild(guild.id);
        if (guildInfo.do_moderation_logging) {
            const channel = guild.channels.cache.get(
                guildInfo.message_logging_channel
            );
            if (channel!.isText()) {
                await channel.send({
                    embeds: [
                        {
                            color: embedColor,
                            author: {
                                name: user.user.username,
                                iconURL:
                                    user.avatarURL() ??
                                    "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
                            },
                            title: `User Muted`,
                            fields: [
                                {
                                    name: "User Id:",
                                    value: user.id,
                                },
                                {
                                    name: "Reason:",
                                    value: reason.length
                                        ? reason
                                        : "No Reason Given",
                                },
                                {
                                    name: "Time",
                                    value: ms(time, { long: true }),
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

export default mute;
