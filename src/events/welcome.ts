import { client } from "..";
import { fetchGuild } from "../utilities/database";

client.on("guildMemberAdd", async (member) => {
    try {
        const guildInfo = await fetchGuild(member.guild.id);

        if (
            guildInfo.set_auto_role &&
            !member.user.bot &&
            guildInfo.auto_role
        ) {
            await member.roles.add(guildInfo.auto_role);
        }

        if (guildInfo.send_welcome && guildInfo.welcome_channel) {
            const channel = await member.guild.channels.fetch(
                guildInfo.welcome_channel
            );

            if (channel?.isText()) {
                await channel!.send(
                    guildInfo.welcome_message.replace(
                        /\{user\}/g,
                        `<@${member.user.id}>`
                    )
                );
            }
        }
    } catch (error) {
        console.log(error);
    }
});
