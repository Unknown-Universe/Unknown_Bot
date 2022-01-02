import { client } from "..";
import { fetchGuild } from "../utilities/database";

client.on("guildMemberAdd", async (user) => {
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
});

client.on("guildMemberRemove", async (user) => {
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
});
