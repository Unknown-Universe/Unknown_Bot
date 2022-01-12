import { commands } from "..";
import { Category } from "../catagories";
import { Command } from "../command";
import { embedColor } from "../utilities/constants";

const help: Command = {
    name: "help",
    description: "Shows a list of commands.",
    category: Category.Utilities,
    usage: `help [Catagory]`,
    aliases: [],
    run: async (message, category) => {
        const categories: Record<string, Command[]> = {};
        for (const command of commands) {
            if (!(command.category in categories))
                categories[command.category] = [];
            categories[command.category].push(command);
        }
        if (!category) {
            await message.reply({
                embeds: [
                    {
                        title: "Catagories",
                        color: embedColor,
                        fields: Object.keys(categories)
                            .filter(
                                (category) => category !== Category.Restricted
                            )
                            .sort((a, b) => a.localeCompare(b))
                            .map((category) => {
                                return {
                                    name: category,
                                    value: `Shows the commands in the ${category.toLowerCase()} category.`,
                                };
                            }),
                    },
                ],
            });
        } else {
            const key = Object.keys(categories).find(
                (item) => item.toLowerCase() === category.toLowerCase()
            );
            if (!key) {
                await message.reply("That is not a valid category.");
                return;
            }
            const items = categories[key];

            await message.reply({
                embeds: [
                    {
                        title: key,
                        color: embedColor,
                        fields: items
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((command) => {
                                return {
                                    name: command.name,
                                    value: command.description,
                                };
                            }),
                    },
                ],
            });
        }
    },
};

export default help;
