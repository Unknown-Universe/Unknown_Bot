import { Client, User } from "discord.js";
import fs, { readdirSync } from "fs";
import path from "path";
import dotenv from "dotenv";
import { Command } from "./command";

dotenv.config();

export function parseUserId(text: string): string | null {
    return text.match(/^<@!?(\d{17,19})>$/)?.[1] ?? null;
}

export const client = new Client({ intents: 4609 });

const commandDir = path.join(__dirname, "commands");
export const commands: Array<Command> = [];

for (const file of fs.readdirSync(commandDir)) {
    if (!file.endsWith(".js")) continue;
    commands.push(require(path.join(commandDir, file)).default as Command);
}

export const prefix = "~";

client.once("ready", async () => {
    console.log("Bot Online");
    client.user!.setActivity({ type: "LISTENING", name: "~help" });
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
            text = text.slice(prefix.length).trimStart();
        else if (text.startsWith(ping))
            text = text.slice(ping.length).trimStart();
        else if (text.startsWith(nick))
            text = text.slice(nick.length).trimStart();
        else return;

        const [name, ...args] = text.split(/\s+/);
        if (!name.length) return;

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

client.login(process.env.TOKEN);
