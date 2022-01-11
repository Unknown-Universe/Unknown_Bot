import { Message } from "discord.js";
import { Track } from "erela.js";
import { manager } from "..";
import { Category } from "../catagories";
import { Command } from "../command";

const playnext: Command = {
    name: "playnext",
    category: Category.Music,
    description:
        "Used to play a song right after the current song using a link",
    useage: "playnext {link}",
    run: async (message, ...args) => {
        const { channel } = message.member!.voice;

        if (!channel) {
            await message.reply("you need to join a voice channel.");
            return;
        }
        if (!args.length) {
            await message.reply("you need to give me a URL or a search term.");
            return;
        }
        const player = manager.create({
            guild: message.guild!.id,
            voiceChannel: channel.id,
            textChannel: message.channel.id,
        });

        if (player.state !== "CONNECTED") player.connect();

        const search = args.join(" ");
        let res;

        try {
            res = await player.search(search, message.author);
            if (res.loadType === "LOAD_FAILED") {
                if (!player.queue.current) player.destroy();
                throw res.exception;
            }
        } catch (err) {
            await message.reply(`there was an error while searching: ${err}`);
            return;
        }

        switch (res.loadType) {
            case "NO_MATCHES":
                if (!player.queue.current) player.destroy();
                await message.reply("there were no results found.");
                return;
            case "TRACK_LOADED":
                player.queue.add(res.tracks[0]);

                if (!player.playing && !player.paused && !player.queue.size)
                    player.play();
                await message.reply(`enqueuing \`${res.tracks[0].title}\`.`);
                return;
            case "PLAYLIST_LOADED":
                player.queue.add(res.tracks);

                if (
                    !player.playing &&
                    !player.paused &&
                    player.queue.totalSize === res.tracks.length
                )
                    player.play();
                await message.reply(
                    `enqueuing playlist \`${res.playlist!.name}\` with ${
                        res.tracks.length
                    } tracks.`
                );
                return;
            case "SEARCH_RESULT":
                let max = 5,
                    collected,
                    filter = (m: Message) =>
                        m.author.id === message.author.id &&
                        /^(\d+|end)$/i.test(m.content);
                if (res.tracks.length < max) max = res.tracks.length;

                const results = res.tracks
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
                } catch (e) {
                    if (!player.queue.current) player.destroy();
                    await message.reply("you didn't provide a selection.");
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
                        `the number you provided too small or too big (1-${max}).`
                    );
                    return;
                }

                const track = res.tracks[index];
                player.queue.unshift(track);

                if (!player.playing && !player.paused && !player.queue.size)
                    player.play();
                await message.reply(`enqueuing \`${track.title}\`.`);
                return;
        }
    },
};

export default playnext;
