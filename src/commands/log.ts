import { Category } from "../types/catagories";
import { Command } from "../types/command";
import {
    invalidChannelMessage,
    invalidUsageMessage,
    permissionMessage,
} from "../utilities/constants";
import { db, fetchGuild } from "../utilities/database";
import { parseChannelId } from "../utilities/parsers";

const log: Command = {
    name: "log",
    category: Category.Configuration,
    description: "Configures message logging",
    usage: "[on, off]",
    aliases: [],
    run: async (message, ...args) => {
        if (!message.member!.permissions.has("MANAGE_GUILD")) {
            await message.reply(permissionMessage);
            return;
        }

        if (!args.length) {
            await message.reply(invalidUsageMessage);
            return;
        }

        const modifier = args.shift();
        const guild = message.guild!;
        const guildInfo = await fetchGuild(guild.id);

        switch (modifier?.toLowerCase()) {
            case "on":
                if (!args.length) {
                    if (!guildInfo.do_message_logging)
                        await db.execute(
                            "UPDATE `guilds` SET `do_message_logging` = 1 WHERE `id` = ?",
                            [guild.id]
                        );
                    if (!guildInfo.do_moderation_logging)
                        await await db.execute(
                            "UPDATE `guilds` SET `do_moderation_logging` = 1 WHERE `id` = ?",
                            [guild.id]
                        );

                    message.reply("Turned on all logging");
                } else if (args[0].toLowerCase() === "message") {
                    if (guildInfo.do_message_logging) {
                        await message.reply("Filter is already on");
                        return;
                    }
                    if (!guildInfo.message_logging_channel) {
                        await message.reply("Please set a log channel first");
                        return;
                    }
                    await db.execute(
                        "UPDATE `guilds` SET `do_message_logging` = 1 WHERE `id` = ?",
                        [guild.id]
                    );
                    await message.reply(`Turned on message logging`);
                } else if (args[0].toLowerCase() === "moderation") {
                    if (guildInfo.do_message_logging) {
                        await message.reply("Filter is already on");
                        return;
                    }
                    if (!guildInfo.message_logging_channel) {
                        await message.reply("Please set a log channel first");
                        return;
                    }
                    await db.execute(
                        "UPDATE `guilds` SET `do_moderation_logging` = 1 WHERE `id` = ?",
                        [guild.id]
                    );
                    await message.reply(`Turned on moderation logging`);
                }
                break;
            case "off":
                if (!args.length) {
                    if (guildInfo.do_message_logging)
                        await db.execute(
                            "UPDATE `guilds` SET `do_message_logging` = 0 WHERE `id` = ?",
                            [guild.id]
                        );
                    if (guildInfo.do_moderation_logging)
                        await await db.execute(
                            "UPDATE `guilds` SET `do_moderation_logging` = 0 WHERE `id` = ?",
                            [guild.id]
                        );

                    message.reply("Turned off all logging");
                } else if (args[0].toLowerCase() === "moderation") {
                    if (!guildInfo.do_message_logging) {
                        await message.reply("Filter is already off");
                        return;
                    }
                    await db.execute(
                        "UPDATE `guilds` SET `do_message_logging` = 0 WHERE `id` = ?",
                        [guild.id]
                    );
                    await message.reply(`Turned off message logging`);
                } else if (args[0].toLowerCase() === "moderation") {
                    if (!guildInfo.do_message_logging) {
                        await message.reply("Filter is already off");
                        return;
                    }
                    if (!guildInfo.message_logging_channel) {
                        await message.reply("Please set a log channel first");
                        return;
                    }
                    await db.execute(
                        "UPDATE `guilds` SET `do_moderation_logging` = 0 WHERE `id` = ?",
                        [guild.id]
                    );
                    await message.reply(`Turned off moderation logging`);
                }
                break;
            case "channel":
                if (!args.length) {
                    await message.reply(invalidChannelMessage);
                    return;
                }
                const channel = await guild.channels.fetch(
                    parseChannelId(args[0])!
                );
                if (!channel) {
                    await message.reply(invalidChannelMessage);
                    return;
                }
                if (channel.type !== "GUILD_TEXT") {
                    await message.reply(invalidChannelMessage);
                    return;
                }
                await db.execute(
                    "UPDATE `guilds` SET `message_logging_channel` = ? WHERE `id` = ?",
                    [channel.id, guild.id]
                );
                await message.reply(`Set log channel to ${channel.id}`);
                break;
        }
    },
};

export default log;
