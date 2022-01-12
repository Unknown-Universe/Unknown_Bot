import { Category } from "../catagories";
import { Command } from "../command";
import { db, fetchGuild } from "../utilities/database";

const counting: Command = {
    name: "counting",
    category: Category.Entertainment,
    description: "Toggles the counting channel in the current channel",
    usage: "counting",
    aliases: [],
    run: async (message, ...args) => {
        if (!message.member!.permissions.has("MANAGE_CHANNELS")) {
            await message.reply("You dont have permission to use this command");
            return;
        }
        const guild = message.guild!;
        const guildInfo = await fetchGuild(guild.id);
        const channel = message.channel;
        if (!args.length) {
            if (!guildInfo.do_counting) {
                await db.execute(
                    "UPDATE `guilds` SET `counting_channel` = ?, `do_counting` = 1 WHERE `id` = ?",
                    [channel.id, guild.id]
                );
                await message.reply(
                    "Turned on counting in this channel, start at 1"
                );
                return;
            } else if (guildInfo.counting_channel !== message.channel.id) {
                await db.execute(
                    "UPDATE `guilds` SET `counting_channel` = ?, `counting_number` = 1 WHERE `id` = ?",
                    [channel.id, guild.id]
                );
                await message.reply(
                    "Moved counting to this channel, start at 1"
                );
                return;
            } else {
                await db.execute(
                    "UPDATE `guilds` SET `do_counting` = 0, `counting_number` = 1 WHERE `id` = ?",
                    [guild.id]
                );
                await message.reply("Turned off counting");
                return;
            }
        }
    },
};

export default counting;
