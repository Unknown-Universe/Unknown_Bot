import { commands, embedColor } from "..";
import { Category } from "../catagories";
import { Command } from "../command";

const help: Command = {
    name: "help",
    description: "Shows a list of commands.",
    category: Category.Utilities,
    useage: `help [Catagory]`,
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
                                (category) =>
                                    ![
                                        Category.Restricted,
                                        Category.ServerSetup,
                                    ].includes(category as Category)
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
                (iCategory) =>
                    iCategory.toLowerCase() === category.toLowerCase()
            );
            if (!key) {
                await message.reply("That is not a valid category.");
                return;
            }
            const items = categories[key];
            console.log(category);

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
