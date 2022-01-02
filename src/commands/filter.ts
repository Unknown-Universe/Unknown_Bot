import { Category } from "../catagories";
import { Command } from "../command";
import { db, FilteredWordData } from "../utilities/database";

const example: Command = {
    name: "filter",
    category: Category.Configuration,
    description: "Used to configure this servers filter",
    useage: "filter help",
    run: async (message, ...args) => {
        if (!message.member!.permissions.has("MANAGE_MESSAGES")) {
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

        const modifier = args.shift()!.toLowerCase();

        switch (modifier) {
            case "add":
                if (!args.length) {
                    await message.reply(
                        `Not enough arguments, run "filter help" to get a list of valid commands`
                    );
                    return;
                }
                for (const word of args) {
                    if (word.length > 64) {
                        await message.reply("Word over 64 characters");
                        return;
                    }
                    await db.execute(
                        "INSERT INTO `filtered_words` (`guild_id`, `word`) VALUES (?, ?)",
                        [message.guildId, word]
                    );
                }
                await message.reply("Added new words to the filter");
                break;
            case "remove":
                if (!args.length) {
                    await message.reply(
                        `Not enough arguments, run "filter help" to get a list of valid commands`
                    );
                    return;
                }
                for (const word of args) {
                    await db.execute(
                        "DELETE FROM `filtered_words` WHERE `guild_id` = ? AND `word` = ?",
                        [message.guildId, word]
                    );
                }
                await message.reply("Removed words from the filter");
                break;
            case "on":
                await db.execute(
                    "UPDATE `guilds` SET `do_filter` = 1 WHERE `id` = ?",
                    [message.guildId]
                );
                await message.reply(
                    "I will now filter words on the filter list"
                );
                break;
            case "off":
                await db.execute(
                    "UPDATE `guilds` SET `do_filter` = 0 WHERE `id` = ?",
                    [message.guildId]
                );
                await message.reply(
                    "I will no longer filter words on the filter list"
                );
                break;
            case "list":
                const [records]: [FilteredWordData[]] = (await db.execute(
                    "SELECT * FROM `filtered_words` WHERE `guild_id` = ?",
                    [message.guildId]
                )) as any;
                await message.reply({
                    embeds: [
                        {
                            title: "Filter List",
                            description: records
                                .map((record) => record.word)
                                .join("\n"),
                        },
                    ],
                });
                break;
        }
    },
};

export default example;
