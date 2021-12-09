import { prefix } from "..";
import { Category } from "../catagories";
import { Command } from "../command";

const help: Command = {
    name: "help",
    description: "Shows a list of commands.",
    category: Category.Utilities,
    useage: `${prefix}help`,
    run: async (message, ...args) => {
        await message.channel.send({
            embeds: [
                {
                    title: "Help",
                    color: 0xa6400d,
                    fields: [
                        {
                            name: `Prefix: ${prefix}`,
                            value: "{} are required fields, and [] are optional fields",
                        },
                        {
                            name: `${prefix}help`,
                            value: "Shows this list",
                        },
                        {
                            name: `${prefix}ping`,
                            value: "Pong",
                        },
                        {
                            name: `${prefix}message {User} {Message}`,
                            value: "Sends {Message} to {User} in a DM",
                        },
                        {
                            name: `${prefix}ban {User} [reason]`,
                            value: "Bans {User} from the server, requires ban_member permission and a higher role then the person your trying to ban",
                        },
                        {
                            name: `${prefix}hardban {User} {Time} [reason]`,
                            value: "Bans {User} from the server, and wipes messages in the past {Time} days, maximum 7",
                        },
                        {
                            name: `${prefix}unban {User}`,
                            value: "Unbans {User} from this server, requires ban_member permission",
                        },
                    ],
                },
            ],
        });
    },
};

export default help;
