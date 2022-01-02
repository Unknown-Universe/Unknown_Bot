import { client } from "..";
import { db, fetchGuild } from "../utilities/database";

client.on("guildMemberAdd", async (user) => {
    const guild = user.guild;
    const guildInfo = await fetchGuild(guild.id);

    const userCount = (await guild.members.fetch()).filter(
        (member) => !member.user.bot
    ).size;
    const botCount = (await guild.members.fetch()).filter(
        (member) => member.user.bot
    ).size;
    if (guildInfo.show_user_count) {
        const channel = await guild.channels.resolve(
            guildInfo.user_count_channel_id.toString()
        );
        await channel!.setName(`User Count: ${userCount}`);
    }
    if (guildInfo.show_total_count) {
        const channel = await guild.channels.resolve(
            guildInfo.total_count_channel_id.toString()
        );
        await channel!.setName(`Total Count: ${guild.memberCount}`);
    }
    if (guildInfo.show_bot_count) {
        const channel = await guild.channels.resolve(
            guildInfo.bot_count_channel_id.toString()
        );
        await channel!.setName(`Bot Count: ${botCount}`);
    }
});

client.on("guildMemberRemove", async (user) => {
    const guild = user.guild;
    const guildInfo = await fetchGuild(guild.id);

    const userCount = (await guild.members.fetch()).filter(
        (member) => !member.user.bot
    ).size;
    const botCount = (await guild.members.fetch()).filter(
        (member) => member.user.bot
    ).size;
    if (guildInfo.show_user_count) {
        const channel = await guild.channels.resolve(
            guildInfo.user_count_channel_id.toString()
        );
        await channel!.setName(`User Count: ${userCount}`);
    }
    if (guildInfo.show_total_count) {
        const channel = await guild.channels.resolve(
            guildInfo.total_count_channel_id.toString()
        );
        await channel!.setName(`Total Count: ${guild.memberCount}`);
    }
    if (guildInfo.show_bot_count) {
        const channel = await guild.channels.resolve(
            guildInfo.bot_count_channel_id.toString()
        );
        await channel!.setName(`Bot Count: ${botCount}`);
    }
});

client.on("channelDelete", async (channel) => {
    if (channel.type === "DM") return;

    const guild = channel.guild;
    const guildInfo = await fetchGuild(guild.id);
    if (guildInfo.show_bot_count) {
        if (channel.id === guildInfo.bot_count_channel_id) {
            await db.execute(
                "UPDATE `guilds` SET `show_bot_count` = 0, `bot_count_channel_id` = NULL WHERE `id` = ?",
                [guild.id]
            );
        }
    } else if (guildInfo.show_total_count) {
        if (channel.id === guildInfo.total_count_channel_id) {
            await db.execute(
                "UPDATE `guilds` SET `show_total_count` = 0, `total_count_channel_id` = NULL WHERE `id` = ?",
                [guild.id]
            );
        }
    } else if (guildInfo.show_user_count) {
        if (channel.id === guildInfo.user_count_channel_id) {
            await db.execute(
                "UPDATE `guilds` SET `show_user_count` = 0, `user_count_channel_id` = NULL WHERE `id` = ?",
                [guild.id]
            );
        }
    }
});
