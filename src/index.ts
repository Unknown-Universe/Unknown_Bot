import { Client, Guild, Message, User } from "discord.js";
import fs, { readdirSync } from "fs";
import path from "path";
import dotenv from "dotenv";
import { Command } from "./command";
import { fetchGuild, GuildModel } from "./database";

dotenv.config();

export function parseUserId(text: string): string | null {
    return text.match(/^<@!?(\d{17,19})>$/)?.[1] ?? null;
}
export function parseChannelId(text: string): string | null {
    return text.match(/^<#(\d{17,19})>$/)?.[1] ?? null;
}
export function parseRoleId(text: string): string | null {
    return text.match(/^<@&(\d{17,19})>$/)?.[1] ?? null;
}
export const client = new Client({ intents: 32767 });

const commandDir = path.join(__dirname, "commands");
export const commands: Array<Command> = [];

for (const file of fs.readdirSync(commandDir)) {
    if (!file.endsWith(".js")) continue;
    commands.push(require(path.join(commandDir, file)).default as Command);
}

client.once("ready", async () => {
    console.log("Bot Online");
    client.user!.setActivity({ type: "WATCHING", name: "Over Your Servers" });
});

client.on("messageCreate", async (message) => {
    try {
        if (!message.guild || message.author.bot) {
            return;
        }

        const prefix = (await fetchGuild(message.guildId!)).prefix;

        const ping = `<@${client.user!.id}>`;
        const nick = `<@!${client.user!.id}>`;
        let text = message.content;
        let mentioned: boolean;
        if (text.startsWith(prefix)) {
            text = text.slice(prefix.length).trimStart();
            mentioned = false;
        } else if (text.startsWith(ping)) {
            text = text.slice(ping.length).trimStart();
            mentioned = true;
        } else if (text.startsWith(nick)) {
            text = text.slice(nick.length).trimStart();
            mentioned = true;
        } else return;

        const [name, ...args] = text.split(" ");
        if (!name.length) {
            if (mentioned) {
                await message.reply(`This servers prefix is ${prefix}`);
            }
            return;
        }
        const command = commands.find(
            (command) => command.name.toLowerCase() === name.toLowerCase()
        );

        if (!command) return;
        await command.run(message, ...args);
    } catch (error) {
        message.reply(`Unknown Error ${error}`);
        console.error(error);
        return;
    }
});

client.on("guildDelete", async (guild) => {
    await GuildModel.deleteMany({ id: guild.id });
});

client.on("guildMemberAdd", async (member) => {
    const guildInfo = await fetchGuild(member.guild.id);

    if (guildInfo.setAutoRole || !member.user.bot) {
        await member.roles.add(guildInfo.autoRole);
    }

    if (guildInfo.sendWelcome) {
        const channel = await member.guild.channels.fetch(
            guildInfo.welcomeChannel
        );

        if (channel?.isText()) {
            await channel!.send(
                guildInfo.welcomeMessage.replace(
                    /\{user\}/g,
                    `<@${member.user.id}>`
                )
            );
        }
    }
});

client.login(process.env.TOKEN);
