import { parseChannelId } from "..";
import { Category } from "../catagories";
import { Command } from "../command";
import { fetchGuild } from "../database";

const SetWelcome: Command = {
    name: "setwelcome",
    category: Category.Configuration,
    description: "Sets the channel that welcome messages get sent to",
    useage: "setwelcome {Channel}",
    run: async (message, ...args) => {
        if (!message.member?.permissions.has("MANAGE_GUILD")) {
            await message.reply(
                "You do not have permission to run this command"
            );
            return;
        }
        if (!args.length) {
            await message.reply("Please give a valid channel");
            return;
        }
        const channelID = parseChannelId(args[0]);

        if (!channelID) {
            await message.reply("Please give a valid channel");
            return;
        }

        if (!(await message.guild?.channels.fetch())!.has(channelID)) {
            await message.reply("Please give a valid channel");
            return;
        }
        const guildInfo = await fetchGuild(message.guild!.id);

        guildInfo.welcomeChannel = channelID;
        await guildInfo.save();
        message.reply(`Changed welcome channel to <#${channelID}>`);
    },
};

export default SetWelcome;
