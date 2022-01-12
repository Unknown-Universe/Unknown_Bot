import { client, commands } from "..";
import { Category } from "../catagories";
import { Command } from "../command";
import { embed } from "../utilities/embed";

const botInfo: Command = {
    name: "botinfo",
    category: Category.Information,
    description: "Shows information about the bot.",
    usage: "",
    aliases: ["bot", "info", "unknownbot"],
    run: async (message) => {
        await message.reply(
            embed({
                author: "UnknownBot",
                icon: client.user!.displayAvatarURL(),
                description: "Here's information about this bot.",
                fields: [
                    {
                        name: "Commands",
                        value: commands.length.toString(),
                        inline: true,
                    },
                    {
                        name: "Servers",
                        value: client.guilds.cache.size.toString(),
                        inline: true,
                    },
                ],
                footer: "100% awesome always.",
            })
        );
    },
};

export default botInfo;
