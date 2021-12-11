import { Category } from "../catagories";
import { Command } from "../command";
import { fetchGuild } from "../database";

const SetWelcomeMessage: Command = {
    name: "setwelcomemessage",
    category: Category.Configuration,
    description:
        "Sets this servers welcome message, user {user} to insert the user",
    useage: "setwelcomemessage {message}",
    run: async (message, ...args) => {
        if (!message.member?.permissions.has("MANAGE_GUILD")) {
            await message.reply("You dont have permission to run this command");
            return;
        }
        if (!args.length) {
            await message.reply("Please give a valid message");
            return;
        }
        const welcomeMessage = args
            .join(" ")
            .replace(/{user}/g, " ".repeat(22));
        if (welcomeMessage.length > 2000 || !welcomeMessage.length) {
            await message.reply("Please give a valid message");
            return;
        }

        const guildInfo = await fetchGuild(message.guild!.id);
        guildInfo.welcomeMessage = args.join(" ");
        guildInfo.save();
        await message.reply(`Welcome message changed`);
    },
};

export default SetWelcomeMessage;
