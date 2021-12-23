import { Category } from "../catagories";
import { Command } from "../command";
import { fetchGuild } from "../database";

const example: Command = {
    name: "filter",
    category: Category.Configuration,
    description: "Used to configure this servers filter",
    useage: "filter help",
    run: async (message, ...args) => {
        if (message.member!.permissions.has("MANAGE_MESSAGES")) {
            await message.reply("You dont have permission to do that");
            return;
        }

        if (!args.length || args[0].toLowerCase() === "help") {
            await message.reply({
                embeds: [
                    {
                        title: "Filter",
                        fields: [
                            {
                                name: "Add",
                                value: "Adds words to the filter",
                            },
                            {
                                name: "Remove",
                                value: "Removes words to the filter",
                            },
                            {
                                name: "On",
                                value: "Turns on the filter",
                            },
                            {
                                name: "Off",
                                value: "Turns off the filter",
                            },
                            {
                                name: "List",
                                value: "Lists the words on the filter",
                            },
                        ],
                    },
                ],
            });
            return;
        }

        args.shift();

        if (!args.length) {
            await message.reply(
                `Not enough arguments, run "filter help" to get a list of valid commands`
            );
            return;
        }

        const serverInfo = await fetchGuild(message.guild!.id);
        const modifier = args[0].toLowerCase();

        switch (modifier) {
            case "add":
                serverInfo.filter.push(...args);
                await serverInfo.save();
                await message.reply("Added new words to the filter");
                break;
            case "remove":
                for (const arg of args) {
                    serverInfo.filter.splice(serverInfo.filter.indexOf(arg), 1);
                }
                await serverInfo.save();
                await message.reply("Removed words from the filter");
                break;
            case "on":
                serverInfo.doFilter = true;
                serverInfo.save();
                await message.reply(
                    "I will now filter words on the filter list"
                );
                break;
            case "off":
                serverInfo.doFilter = false;
                serverInfo.save();
                await message.reply(
                    "I will no longer filter words on the filter list"
                );
                break;
            case "list":
                await message.reply({
                    embeds: [
                        {
                            title: "Filter List",
                            fields: serverInfo.filter.map((word) => {
                                return {
                                    name: word,
                                    value: "",
                                };
                            }),
                        },
                    ],
                });
                break;
        }
    },
};

export default example;
