import { client } from "..";
import { db, fetchGuild } from "../utilities/database";

client.on("guildMemberAdd", async (user) => {
    try {
        const guild = user.guild;
        const guildInfo = await fetchGuild(guild.id);
        const members = await guild.members.fetch();

        const userCount = members.filter((member) => !member.user.bot).size;
        const botCount = members.filter((member) => member.user.bot).size;

        if (guildInfo.show_user_count) {
            const channel = guild.channels.cache.get(
                guildInfo.user_count_channel_id.toString()
            );
            await channel!.setName(`User Count: ${userCount}`);
        }

        if (guildInfo.show_total_count) {
            const channel = guild.channels.cache.get(
                guildInfo.total_count_channel_id.toString()
            );
            await channel!.setName(`Total Count: ${members.size}`);
        }

        if (guildInfo.show_bot_count) {
            const channel = guild.channels.cache.get(
                guildInfo.bot_count_channel_id.toString()
            );
            await channel!.setName(`Bot Count: ${botCount}`);
        }
    } catch (error) {
        console.log(error);
    }
});

client.on("guildMemberRemove", async (user) => {
    try {
        const guild = user.guild;
        const guildInfo = await fetchGuild(guild.id);
        const members = await guild.members.fetch();

        const userCount = members.filter((member) => !member.user.bot).size;
        const botCount = members.filter((member) => member.user.bot).size;

        if (guildInfo.show_user_count) {
            const channel = guild.channels.cache.get(
                guildInfo.user_count_channel_id.toString()
            );
            await channel!.setName(`User Count: ${userCount}`);
        }

        if (guildInfo.show_total_count) {
            const channel = guild.channels.cache.get(
                guildInfo.total_count_channel_id.toString()
            );
            await channel!.setName(`Total Count: ${members.size}`);
        }

        if (guildInfo.show_bot_count) {
            const channel = guild.channels.cache.get(
                guildInfo.bot_count_channel_id.toString()
            );
            await channel!.setName(`Bot Count: ${botCount}`);
        }
    } catch (error) {
        console.log(error);
    }
});

client.on("channelDelete", async (channel) => {
    try {
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
    } catch (error) {
        console.log(error);
    }
});
