import { client } from "..";
import { embedColor } from "../utilities/constants";
import { fetchGuild } from "../utilities/database";

client.on("messageDelete", async (message) => {
    try {
        if (
            message.partial ||
            message.channel.type === "DM" ||
            !message.member ||
            message.member!.user.bot
        )
            return;

        const guild = message.guild!;
        const guildInfo = await fetchGuild(guild.id);

        if (guildInfo.do_message_logging) {
            const logChannel = await guild.channels.fetch(
                guildInfo.message_logging_channel
            );
            if (logChannel!.isText()) {
                await logChannel.send({
                    embeds: [
                        {
                            color: embedColor,
                            author: {
                                name: message.author.username,
                                iconURL:
                                    message.author.avatarURL() ??
                                    "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
                            },
                            title: "Message Deleted",
                            description: `In channel: ${message.channel}`,
                            fields: [
                                {
                                    name: "Message:",
                                    value: message.content,
                                    inline: false,
                                },
                                {
                                    name: "\u200b",
                                    value: "\u200b",
                                    inline: false,
                                },
                            ],
                            footer: {
                                text: "UnknownBot Message Logging",
                                iconURL:
                                    client.user!.avatarURL() ??
                                    "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
                            },
                        },
                    ],
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
    try {
        if (
            oldMessage.partial ||
            oldMessage.channel.type === "DM" ||
            oldMessage.member!.user.bot
        )
            return;

        const guild = oldMessage.guild!;
        const guildInfo = await fetchGuild(guild.id);
        if (guildInfo.do_message_logging) {
            const logChannel = await guild.channels.fetch(
                guildInfo.message_logging_channel
            );
            if (logChannel!.isText()) {
                await logChannel.send({
                    embeds: [
                        {
                            color: embedColor,
                            author: {
                                name: oldMessage.author.username,
                                iconURL:
                                    oldMessage.author.avatarURL() ??
                                    "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
                            },
                            title: "Message Edit",
                            description: `In channel: ${oldMessage.channel}`,
                            fields: [
                                {
                                    name: "Old Message:",
                                    value: oldMessage.content || "No Content",
                                    inline: true,
                                },
                                {
                                    name: "New Message:",
                                    value: newMessage.content ?? "[removed]",
                                    inline: true,
                                },
                                {
                                    name: "\u200b",
                                    value: "\u200b",
                                    inline: false,
                                },
                            ],
                            footer: {
                                text: "UnknownBot Message Logging",
                                iconURL:
                                    client.user!.avatarURL() ??
                                    "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
                            },
                        },
                    ],
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
});

client.on("guildBanAdd", async (ban) => {
    try {
        const user = ban.user;
        const guild = ban.guild;
        const reason = ban.reason;
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
                                name: user.username,
                                iconURL:
                                    user.avatarURL() ??
                                    "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
                            },
                            title: `User Banned`,
                            fields: [
                                {
                                    name: "User Id:",
                                    value: user.id,
                                },
                                {
                                    name: "Reason:",
                                    value: reason ?? "No Reason Given",
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
    } catch (error) {
        console.log(error);
    }
});
