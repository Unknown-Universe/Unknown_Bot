import { client } from "..";
import { fetchGuild } from "../utilities/database";

client.on("messageDelete", async (message) => {
    if (
        message.partial ||
        message.channel.type === "DM" ||
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
                        title: `Message Deleted in ${message.channel.name}`,
                        fields: [
                            {
                                name: "User:",
                                value: message.member!.user.username,
                            },
                            {
                                name: "Message:",
                                value: message.content || "No Content",
                            },
                            {
                                name: "Time:",
                                value: `<t:${Math.floor(Date.now() / 1000)}>`,
                            },
                        ],
                    },
                ],
            });
        }
    }
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
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
                        title: `Message Edit in ${oldMessage.channel.name}`,
                        fields: [
                            {
                                name: "User:",
                                value: oldMessage.member!.user.username,
                            },
                            {
                                name: "Old Message:",
                                value: oldMessage.content || "No Content",
                            },
                            {
                                name: "New Message:",
                                value: newMessage.content ?? "[removed]",
                            },
                            {
                                name: "Time:",
                                value: `<t:${Math.floor(Date.now() / 1000)}>`,
                            },
                        ],
                    },
                ],
            });
        }
    }
});

client.on("guildBanAdd", async (ban) => {
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
                        title: `User Banned`,
                        fields: [
                            {
                                name: "User:",
                                value: user.username,
                            },
                            {
                                name: "User Id:",
                                value: user.id,
                            },
                            {
                                name: "Reason:",
                                value: reason ?? "No Reason Given",
                            },
                        ],
                    },
                ],
            });
        }
    }
});
