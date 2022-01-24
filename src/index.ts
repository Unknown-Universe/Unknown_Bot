import { Client } from "discord.js";
import { Manager, Player } from "erela.js";
import Spotify from "erela.js-spotify";
import fs from "fs";
import path from "path";
import { Command } from "./types/command";
import "./utilities/database";

export const client = new Client({
    intents: 32767,
    partials: ["CHANNEL", "MESSAGE", "REACTION"],
});

const trackTimeouts = new Map<Player, NodeJS.Timeout>();

export const manager = new Manager({
    plugins: [
        new Spotify({
            clientID: process.env.SPOTIFY_CLIENT_ID!,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
        }),
    ],
    nodes: [
        {
            host: "127.0.0.1",
            port: 2333,
            password: process.env.LAVALINK_PASSWORD,
        },
    ],
    autoPlay: true,
    send: (id, payload) => {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
})
    .on("nodeConnect", (node) =>
        console.log(`Node "${node.options.identifier}" connected.`)
    )
    .on("nodeError", (node, error) =>
        console.log(
            `Node "${node.options.identifier}" encountered an error: ${error.message}.`
        )
    )
    .on("trackStart", (player, track) => {
        const channel = client.channels.cache.get(player.textChannel!);
        const timeout = trackTimeouts.get(player);
        if (timeout) {
            clearTimeout(timeout);
            trackTimeouts.delete(player);
        }
        if (channel?.type !== "GUILD_TEXT") return;
        channel?.send(
            `Now playing: \`${track.title}\`, requested by \`${
                (track.requester as any).tag
            }\`.`
        );
    })
    .on("queueEnd", (player) => {
        const channel = client.channels.cache.get(player.textChannel!);
        if (channel?.type !== "GUILD_TEXT") return;
        channel?.send("Queue has ended.");
        trackTimeouts.set(
            player,
            setTimeout(() => {
                player.destroy();
            }, 1000 * 60 * 5)
        );
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
    manager.init(client.user?.id);
    client.user!.setActivity({ type: "WATCHING", name: "Over Your Servers" });
});

process.on("unhandledRejection", (error) => {
    console.error("Unhandled promise rejection:", error);
});

client.on("raw", (d) => manager.updateVoiceState(d));

client.login(process.env.TOKEN);
