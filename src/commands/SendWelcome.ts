import { Category } from "../catagories";
import { Command } from "../command";
import { fetchGuild } from "../database";

const SendWelcome: Command = {
    name: "sendWelcome",
    category: Category.Configuration,
    description: "Set whether to send a welcome message or not",
    useage: "sendWelcome {True or False}",
    run: async (message, ...args) => {
        if (!message.member?.permissions.has("MANAGE_GUILD")) {
            await message.reply("You dont have permission to run this command");
            return;
        }
        if (!args.length) {
            await message.reply("Please say true or false");
            return;
        }
        const guildInfo = await fetchGuild(message.guild!.id);
        if (!guildInfo.welcomeChannel) {
            await message.reply("Please set a welcome channel");
            return;
        }

        guildInfo.sendWelcome = true;
        await guildInfo.save();
        await message.reply("I will now welcome members");
    },
};

export default SendWelcome;
