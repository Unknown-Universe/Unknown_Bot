import { Category } from "../catagories";
import { commands } from "..";
import { Command } from "../command";

const help: Command = {
    name: "help",
    description: "Shows a list of commands.",
    category: Category.Utilities,
    useage: `help [Catagory]`,
    run: async (message, ...args) => {
        if (!args.length) {
            message.channel.send({
                embeds: [
                    {
                        title: "Catagories",
                        color: 0xa6400d,
                        fields: [
                            {
                                name: "Moderation",
                                value: "Moderation Commands",
                            },
                            {
                                name: "Utilities",
                                value: "Utilities Commands",
                            },
                            {
                                name: "Configuration",
                                value: "Configuration Commands",
                            },
                            {
                                name: "Information",
                                value: "Information Commands",
                            },
                            {
                                name: "Entertainment",
                                value: "Entertainment Commands",
                            },
                        ],
                    },
                ],
            });
        } else if (args[0] === "moderation" || args[0] === "Moderation") {
            await message.channel.send({
                embeds: [
                    {
                        title: "Moderation",
                        color: 0xa6400d,
                        fields: commands
                            .filter(
                                (command) =>
                                    command.category === Category.Moderation
                            )
                            .map((command) => {
                                return {
                                    name:
                                        command.name.slice(0, 1).toUpperCase() +
                                        command.name.slice(1),
                                    value:
                                        command.useage +
                                        `\n` +
                                        command.description,
                                };
                            }),
                    },
                ],
            });
        } else if (args[0] === "utilities" || args[0] === "Utilities") {
            await message.channel.send({
                embeds: [
                    {
                        title: "Utilities",
                        color: 0xa6400d,
                        fields: commands
                            .filter(
                                (command) =>
                                    command.category === Category.Utilities
                            )
                            .map((command) => {
                                return {
                                    name:
                                        command.name.slice(0, 1).toUpperCase() +
                                        command.name.slice(1),
                                    value:
                                        command.useage +
                                        `\n` +
                                        command.description,
                                };
                            }),
                    },
                ],
            });
        } else if (args[0] === "configuration" || args[0] === "Configuration") {
            await message.channel.send({
                embeds: [
                    {
                        title: "Configuration",
                        color: 0xa6400d,
                        fields: commands
                            .filter(
                                (command) =>
                                    command.category === Category.Configuration
                            )
                            .map((command) => {
                                return {
                                    name:
                                        command.name.slice(0, 1).toUpperCase() +
                                        command.name.slice(1),
                                    value:
                                        command.useage +
                                        `\n` +
                                        command.description,
                                };
                            }),
                    },
                ],
            });
        } else if (args[0] === "information" || args[0] === "Information") {
            await message.channel.send({
                embeds: [
                    {
                        title: "Information",
                        color: 0xa6400d,
                        fields: commands
                            .filter(
                                (command) =>
                                    command.category === Category.Information
                            )
                            .map((command) => {
                                return {
                                    name:
                                        command.name.slice(0, 1).toUpperCase() +
                                        command.name.slice(1),
                                    value:
                                        command.useage +
                                        `\n` +
                                        command.description,
                                };
                            }),
                    },
                ],
            });
        } else if (args[0] === "entertainment" || args[0] === "Entertainment") {
            await message.channel.send({
                embeds: [
                    {
                        title: "Entertainment",
                        color: 0xa6400d,
                        fields: commands
                            .filter(
                                (command) =>
                                    command.category === Category.Entertainment
                            )
                            .map((command) => {
                                return {
                                    name:
                                        command.name.slice(0, 1).toUpperCase() +
                                        command.name.slice(1),
                                    value:
                                        command.useage +
                                        `\n` +
                                        command.description,
                                };
                            }),
                    },
                ],
            });
        }
    },
};

export default help;

// await message.channel.send({
//     embeds: [
//         {
//             title: "Help",
//             color: 0xa6400d,
//             fields: commands
//                 .filter(
//                     (command) =>
//                         command.category !== Category.Restricted &&
//                         command.category !== Category.ServerSetup
//                 )
//                 .map((command) => {
//                     return {
//                         name:
//                             command.name.slice(0, 1).toUpperCase() +
//                             command.name.slice(1),
//                         value:
//                             command.useage + `\n` + command.description,
//                     };
//                 }),
//         },
//     ],
// });
