import { Client } from "discord.js";
import fs from "fs";
import path from "path";
import { Command } from "./command";

export const client = new Client({
    intents: 32767,
    partials: ["CHANNEL", "MESSAGE", "REACTION"],
});

const commandDir = path.join(__dirname, "commands");
const eventDir = path.join(__dirname, "events");
export const commands: Array<Command> = [];

for (const file of fs.readdirSync(commandDir)) {
    if (!file.endsWith(".js")) continue;
    commands.push(require(path.join(commandDir, file)).default as Command);
}

for (const file of fs.readdirSync(eventDir)) {
    if (!file.endsWith(".js")) continue;
    require(path.join(eventDir, file));
}

client.once("ready", async () => {
    console.log("Bot Online");
    client.user!.setActivity({ type: "WATCHING", name: "Over Your Servers" });
});

client.login(process.env.TOKEN);
