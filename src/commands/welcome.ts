import { Category } from "../catagories";
import { Command } from "../command";
import { embedColor } from "../utilities/constants";
import { db, fetchGuild } from "../utilities/database";
import { parseChannelId } from "../utilities/parsers";

const welcome: Command = {
    name: "welcome",
    category: Category.Configuration,
    description: "Configures the servers welcome message",
    useage: "welcome help",
    run: async (message, ...args) => {
        if (!message.member!.permissions.has("MANAGE_GUILD")) {
            await message.reply("You dont have permission to use this command");
            return;
        }

        if (!args.length || args[0].toLowerCase() === "help") {
            message.reply({
                embeds: [
                    {
                        color: embedColor,
                        title: "Configure Welcome Message",
                        fields: [
                            {
                                name: "Send",
                                value: "Set whether to send a welcome message or not",
                            },
                            {
                                name: "Channel",
                                value: "Sets the channel that welcome messages get sent to",
                            },
                            {
                                name: "Message",
                                value: "Sets this servers welcome message, user {user} to insert the user",
                            },
                            {
                                name: "Help",
                                value: "Shows this menu",
                            },
                        ],
                    },
                ],
            });
            return;
        }
        const guildInfo = await fetchGuild(message.guild!.id);
        const modifier = args.shift()!.toLowerCase();

        switch (modifier) {
            case "send":
                if (
                    !args.length ||
                    !(
                        args[0].toLowerCase() === "true" ||
                        args[0].toLowerCase() === "false"
                    )
                ) {
                    await message.reply("Please set it to true or false");
                    return;
                }
                if (!guildInfo.welcome_channel) {
                    await message.reply("Please set a welcome channel");
                    return;
                }
                await db.execute(
                    "UPDATE `guilds` SET `send_welcome` = ? WHERE `id` = ?",
                    [
                        message.guildId,
                        args[0].toLowerCase() === "false" ? "0" : "1",
                    ]
                );
                await message.reply(
                    `I will ${
                        args[0].toLowerCase() === "false"
                            ? "no longer welcome"
                            : "now welcome"
                    } new members`
                );
                return;
            case "channel":
                if (!args.length) {
                    await message.reply("Please give a valid channel");
                    return;
                }
                const channelID = parseChannelId(args[0]);

                if (!channelID) {
                    await message.reply("Please give a valid channel");
                    return;
                }

                if (!(await message.guild?.channels.fetch())!.has(channelID)) {
                    await message.reply("Please give a valid channel");
                    return;
                }

                await db.execute(
                    "UPDATE `guilds` SET `welcome_channel` = ? WHERE `id` = ?",
                    [channelID, message.guildId]
                );

                message.reply(`Changed welcome channel to <#${channelID}>`);
                return;
            case "message":
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
                await db.execute(
                    "UPDATE `guilds` SET `welcome_message` = ? WHERE `id` = ?",
                    [args.join(" "), message.guildId]
                );
                await message.reply(`Welcome message changed`);
        }
    },
};

export default welcome;
