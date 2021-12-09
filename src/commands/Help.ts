import { commands, prefix } from "..";
import { Category } from "../catagories";
import { Command } from "../command";

const help: Command = {
    name: "help",
    description: "Shows a list of commands.",
    category: Category.Utilities,
    useage: `help`,
    run: async (message, ...args) => {
        await message.channel.send({
            embeds: [
                {
                    title: "Help",
                    color: 0xa6400d,
                    fields: commands.map((command) => {
                        return {
                            name:
                                command.name.slice(0, 1).toUpperCase() +
                                command.name.slice(1),
                            value: command.useage + `\n` + command.description,
                        };
                    }),
                },
            ],
        });
    },
};

export default help;
