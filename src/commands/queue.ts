import { manager } from "..";
import { Category } from "../catagories";
import { Command } from "../command";
import { embedColor } from "../utilities/constants";

const queue: Command = {
    name: "queue",
    category: Category.Music,
    description: "Used to list the queue",
    usage: "queue {page}",
    aliases: [],
    run: async (message, ...args) => {
        const player = manager.get(message.guild!.id);
        if (!player) {
            await message.reply("There is no player for this guild.");
            return;
        }

        const queue = player.queue;

        // change for the amount of tracks per page
        const multiple = 10;
        const page = args.length && Number(args[0]) ? Number(args[0]) : 1;

        const end = page * multiple;
        const start = end - multiple;

        const tracks = queue.slice(start, end);

        const maxPages = Math.ceil(queue.length / multiple);

        await message.reply({
            embeds: [
                {
                    color: embedColor,
                    author: { name: `Queue for ${message.guild!.name}` },
                    description: !tracks.length
                        ? `No tracks in ${
                              page > 1 ? `page ${page}` : "the queue"
                          }.`
                        : tracks
                              .map(
                                  (track, i) =>
                                      `${start + ++i} - [${track.title}](${
                                          track.uri
                                      })`
                              )
                              .join("\n"),
                    fields: [
                        {
                            name: "Current",
                            value: `[${queue.current!.title}](${
                                queue.current!.uri
                            })`,
                        },
                    ],
                    footer: {
                        text: `Page ${
                            page > maxPages ? maxPages : page
                        } of ${maxPages}`,
                    },
                },
            ],
        });
        return;
    },
};

export default queue;
