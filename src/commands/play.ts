import { Message } from "discord.js";
import { Track } from "erela.js";
import { manager } from "..";
import { Category } from "../catagories";
import { Command } from "../command";

const play: Command = {
    name: "play",
    category: Category.Music,
    description:
        "Used to play a song using a link to a video, or spotify song or playlist",
    usage: "play {link, playlist}",
    aliases: [],
    run: async (message, ...args) => {
        const { channel } = message.member!.voice;

        if (!channel) {
            await message.reply("You need to join a voice channel.");
            return;
        }
        if (!args.length) {
            await message.reply("You need to give me a URL or a search term.");
            return;
        }
        const player = manager.create({
            guild: message.guild!.id,
            voiceChannel: channel.id,
            textChannel: message.channel.id,
        });

        if (player.state !== "CONNECTED") player.connect();

        const search = args.join(" ");
        let result;

        try {
            result = await player.search(search, message.author);
            if (result.loadType === "LOAD_FAILED") {
                if (!player.queue.current) player.destroy();
                throw result.exception;
            }
        } catch (err) {
            await message.reply(`There was an error while searching: ${err}`);
            return;
        }

        switch (result.loadType) {
            case "NO_MATCHES":
                if (!player.queue.current) player.destroy();
                await message.reply("There were no results found.");
                return;
            case "TRACK_LOADED":
                player.queue.add(result.tracks[0]);

                if (!player.playing && !player.paused && !player.queue.size)
                    player.play();
                await message.reply(`Enqueuing \`${result.tracks[0].title}\`.`);
                return;
            case "PLAYLIST_LOADED":
                player.queue.add(result.tracks);

                if (
                    !player.playing &&
                    !player.paused &&
                    player.queue.totalSize === result.tracks.length
                )
                    player.play();
                await message.reply(
                    `Enqueuing playlist \`${result.playlist!.name}\` with ${
                        result.tracks.length
                    } tracks.`
                );
                return;
            case "SEARCH_RESULT":
                let max = 5,
                    collected,
                    filter = (m: Message) =>
                        m.author.id === message.author.id &&
                        /^(\d+|end)$/i.test(m.content);
                if (result.tracks.length < max) max = result.tracks.length;

                const results = result.tracks
                    .slice(0, max)
                    .map(
                        (track: Track, index: number) =>
                            `${++index} - \`${track.title}\``
                    )
                    .join("\n");

                await message.channel.send(results);

                try {
                    collected = await message.channel.awaitMessages({
                        filter,
                        max: 1,
                        time: 10000,
                        errors: ["time"],
                    });
                } catch {
                    if (!player.queue.current) player.destroy();
                    await message.reply("You didn't provide a selection.");
                    return;
                }

                const first = collected.first()!.content;

                if (first.toLowerCase() === "end") {
                    if (!player.queue.current) player.destroy();
                    await message.channel.send("Cancelled selection.");
                    return;
                }

                const index = Number(first) - 1;
                if (index < 0 || index > max - 1) {
                    await message.reply(
                        `The number you provided too small or too big (1-${max}).`
                    );
                    return;
                }
                const track = result.tracks[index];

                player.queue.add(track);
                if (!player.playing && !player.paused && !player.queue.size)
                    player.play();
                await message.reply(`Enqueuing \`${track.title}\`.`);
                return;
        }
    },
};

export default play;
