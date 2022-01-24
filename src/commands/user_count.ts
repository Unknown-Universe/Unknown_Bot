import { Category } from "../types/catagories";
import { Command } from "../types/command";
import { embedColor, permissionMessage } from "../utilities/constants";
import { db, fetchGuild } from "../utilities/database";

const usercount: Command = {
    name: "usercount",
    category: Category.Configuration,
    description:
        "Makes or deletes a channel that keeps track of how many users are in the server, run usercount help for more information",
    usage: "<showbot, hidebot, showuser, hideuser, showtotal, hidetotal>",
    aliases: [],
    run: async (message, ...args) => {
        if (!message.member!.permissions.has("MANAGE_GUILD")) {
            await message.reply(permissionMessage);
            return;
        }
        if (!args.length || args[0].toLowerCase() === "help") {
            await message.reply({
                embeds: [
                    {
                        color: embedColor,
                        title: "usercount",
                        fields: [
                            {
                                name: "showuser",
                                value: "Turns on the user count",
                            },
                            {
                                name: "showbot",
                                value: "Turns on the bot count",
                            },
                            {
                                name: "showtotal",
                                value: "Turns on the total count",
                            },
                            {
                                name: "hideuser",
                                value: "Turns off the user count",
                            },
                            {
                                name: "hidebot",
                                value: "Turns off the bot count",
                            },
                            {
                                name: "hidetotal",
                                value: "Turns off the total count",
                            },
                        ],
                    },
                ],
            });
            return;
        }

        const modifier = args.shift()!.toLowerCase();
        const guild = message.guild!;
        const guildInfo = await fetchGuild(guild.id);
        const userCount = (await guild.members.fetch()).filter(
            (member) => !member.user.bot
        ).size;
        const botCount = (await guild.members.fetch()).filter(
            (member) => member.user.bot
        ).size;

        switch (modifier) {
            case "showbot":
                if (guildInfo.show_bot_count) {
                    message.reply("Bot Count already shown");
                    return;
                }
                const botChannel = await guild.channels.create(
                    `Bot Count: ${botCount}`,
                    {
                        type: "GUILD_VOICE",
                        permissionOverwrites: [
                            {
                                id: guild.roles.everyone,
                                deny: ["CONNECT"],
                            },
                        ],
                    }
                );
                await db.execute(
                    "UPDATE `guilds` SET `bot_count_channel_id` = ? WHERE `id` = ?",
                    [botChannel.id, message.guildId]
                );
                await db.execute(
                    "UPDATE `guilds` SET `show_bot_count` = ? WHERE `id` = ?",
                    [botCount, message.guildId]
                );
                await message.reply("Showing bot count");
                break;

            case "hidebot":
                if (!guildInfo.show_bot_count) {
                    message.reply("Show Bot already turned off");
                    return;
                }
                const botChannelRemove = await guild.channels.fetch(
                    guildInfo.bot_count_channel_id.toString()
                );
                await botChannelRemove!.delete();
                await db.execute(
                    "UPDATE `guilds` SET `show_bot_count` = 0 WHERE `id` = ?",
                    [message.guildId]
                );
                await message.reply("No longer showing bot count");
                break;

            case "showuser":
                if (guildInfo.show_user_count) {
                    message.reply("User Count already shown");
                    return;
                }
                const userChannel = await guild.channels.create(
                    `User Count: ${userCount}`,
                    {
                        type: "GUILD_VOICE",
                        permissionOverwrites: [
                            {
                                id: guild.roles.everyone,
                                deny: ["CONNECT"],
                            },
                        ],
                    }
                );
                await db.execute(
                    "UPDATE `guilds` SET `user_count_channel_id` = ?, `show_user_count` = 1 WHERE `id` = ?",
                    [userChannel.id, message.guildId]
                );
                await message.reply("Showing user count");
                return;
            case "hideuser":
                if (!guildInfo.show_bot_count) {
                    message.reply("Show user already turned off");
                    return;
                }
                const userChannelDelete = await guild.channels.fetch(
                    guildInfo.user_count_channel_id.toString()
                );
                await userChannelDelete!.delete();
                await db.execute(
                    "UPDATE `guilds` SET `show_user_count` = 0 WHERE `id` = ?",
                    [message.guildId]
                );
                await message.reply("No longer showing user count");
                break;

            case "showtotal":
                if (guildInfo.show_total_count) {
                    message.reply("Total Count already shown");
                    return;
                }
                const totalChannel = await guild.channels.create(
                    `Total Count: ${guild.memberCount}`,
                    {
                        type: "GUILD_VOICE",
                        permissionOverwrites: [
                            {
                                id: guild.roles.everyone,
                                deny: ["CONNECT"],
                            },
                        ],
                    }
                );
                await db.execute(
                    "UPDATE `guilds` SET `total_count_channel_id` = ? WHERE `id` = ?",
                    [totalChannel.id, message.guildId]
                );
                await message.reply("Showing total count");
                break;

            case "hidetotal":
                if (!guildInfo.show_total_count) {
                    message.reply("Show total already turned off");
                    return;
                }
                const totalChannelDelete = await guild.channels.fetch(
                    guildInfo.total_count_channel_id.toString()
                );
                await totalChannelDelete!.delete();
                await db.execute(
                    "UPDATE `guilds` SET `show_total_count` = 0 WHERE `id` = ?",
                    [message.guildId]
                );
                await message.reply("No longer showing total count");
                break;
        }
    },
};

export default usercount;
