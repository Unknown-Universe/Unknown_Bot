import { Client, User } from "discord.js";
import fs, { readdirSync } from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

function parseUserId(text: string): string | null {
    return text.match(/^<@!?(\d{17,19})>$/)?.[1] ?? null;
}

export const client = new Client({ intents: 4609 });

// const commandDir = path.join(__dirname, "commands");
// export const commands: Array<Command> = [];

// for (const file of fs.readdirSync(commandDir)) {
//     if (!file.endsWith(".ts")) continue;
//     commands.push(require(path.join(commandDir, file)) as Command);
// }

const prefix = "~";

client.once("ready", async () => {
    console.log("Bot Online");
    await client.user!.setActivity({ type: "LISTENING", name: "~help" });
});
client.on("messageCreate", async (message) => {
    try {
        if (!message.guild || message.author.bot) {
            return;
        }

        const ping = `<@${client.user!.id}>`;
        const nick = `<@!${client.user!.id}>`;
        let text = message.content;

        if (text.startsWith(prefix))
            text = text.slice(prefix.length).trimLeft();
        else if (text.startsWith(ping))
            text = text.slice(ping.length).trimLeft();
        else if (text.startsWith(nick))
            text = text.slice(nick.length).trimLeft();
        else return;

        const [name, ...args] = text.split(/\s+/);
        if (!name.length) return;

        if (name === "ping") {
            await message.reply("pong!");
        } else if (name === "help") {
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
        } else if (name === "message") {
            if (!args.length) {
                await message.reply("No Arguments Given");
                return;
            }
            const userID = parseUserId(args[0]);
            const content = args.slice(1).join(" ");

            if (userID === null) {
                await message.reply("No User Given");
                return;
            }
            if (!content.length || content.length > 2000) {
                await message.reply("Invalid Message");
                return;
            }
            const user = await client.users.fetch(userID);
            await user.send(
                `**${message.author.username}**, from **${message.guild?.name}** sent you: **${content}**`
            );
            await message.reply("Message Sent");
        } else if (name === "ban") {
            if (!message.member?.permissions.has("BAN_MEMBERS")) {
                await message.reply(
                    "You dont have permission to use this command"
                );
                return;
            }
            if (!args.length) {
                await message.reply("No Arguments Given");
                return;
            }

            const userID = parseUserId(args[0]);
            const reason = args.slice(1).join(" ");
            if (userID === null) {
                await message.reply("No User Given");
                return;
            }
            const user = await message.guild!.members.fetch(userID);
            if (!user.bannable) {
                await message.reply("User is not bannable");
                return;
            }
            if (reason.length > 512) {
                await message.reply("Reason to Long");
                return;
            }

            if (
                message.guild.me!.roles.highest.comparePositionTo(
                    user.roles.highest
                ) <= 0
            ) {
                await message.reply(
                    "Unable to ban user with higher roles than me"
                );
                return;
            }
            if (
                message.member.roles.highest.comparePositionTo(
                    user.roles.highest
                ) <= 0
            ) {
                await message.reply(
                    "You cant ban users with higher roles then you"
                );
                return;
            }
            try {
                await user.send(
                    `You were banned from ${message.guild.name} ${
                        reason.length ? `for ${reason}` : ""
                    }`
                );
            } catch {}
            await user.ban({
                reason: reason.length ? reason : undefined,
            });
            await message.reply(`${user.user.tag} has been banned`);
        } else if (name === "hardban") {
            if (!message.member?.permissions.has("BAN_MEMBERS")) {
                await message.reply(
                    "You dont have permission to use this command"
                );
                return;
            }
            if (!args.length) {
                await message.reply("No Arguments Given");
                return;
            }

            const userID = parseUserId(args[0]);
            const reason = args.slice(1).join(" ");

            if (+args[1] == NaN || +args[1] < 0 || +args[1] > 7) {
                await message.reply("Please give a vaild number 1-7");
                return;
            }
            const wipeTime: number = +args[1];

            if (userID === null) {
                await message.reply("No User Given");
                return;
            }
            const user = await message.guild!.members.fetch(userID);
            if (!user.bannable) {
                await message.reply("User is not bannable");
                return;
            }
            if (reason.length > 512) {
                await message.reply("Reason to Long");
                return;
            }

            if (
                message.guild.me!.roles.highest.comparePositionTo(
                    user.roles.highest
                ) <= 0
            ) {
                await message.reply(
                    "Unable to ban user with higher roles than me"
                );
                return;
            }
            if (
                message.member.roles.highest.comparePositionTo(
                    user.roles.highest
                ) <= 0
            ) {
                await message.reply(
                    "You cant ban users with higher roles then you"
                );
                return;
            }
            try {
                await user.send(
                    `You were banned from ${message.guild.name} ${
                        reason.length ? `for ${reason}` : ""
                    }`
                );
            } catch {}
            await user.ban({
                reason: reason.length ? reason : undefined,
                days: wipeTime,
            });
            await message.reply(
                `${user.user.tag} has been banned and messages send in the past ${wipeTime} days wiped`
            );
        } else if (name === "unban") {
            if (!message.member?.permissions.has("BAN_MEMBERS")) {
                await message.reply(
                    "You dont have permission to use this command"
                );
                return;
            }
            if (!args.length) {
                await message.reply("No Arguments Given");
                return;
            }

            const userID =
                parseUserId(args[0]) ?? args[0].match(/^(\d{17,19})$/)?.[1];

            const reason = args.slice(1).join(" ");
            if (!userID) {
                await message.reply("No User Given");
                return;
            }
            try {
                await message.guild.bans.fetch(userID);
            } catch {
                message.reply("Member not banned");
                return;
            }
            await message.guild.bans.remove(userID);
            await message.reply(`User Unbanned`);
        }
    } catch (error) {
        message.reply(`Unknown Error ${error}`);
        console.error(error);
        return;
    }
});

client.login(process.env.TOKEN);
