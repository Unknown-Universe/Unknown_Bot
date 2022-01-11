import { manager } from "..";
import { Category } from "../catagories";
import { Command } from "../command";

const shuffle: Command = {
    name: "shuffle",
    category: Category.Music,
    description: "Used to shuffle the queue",
    useage: "shuffle",
    run: async (message, ...args) => {
        const player = manager.get(message.guild!.id);
        if (!player) {
            await message.reply("there is no player for this guild.");
            return;
        }

        const { channel } = message.member!.voice;

        if (!channel) {
            message.reply("you need to join a voice channel.");
            return;
        }
        if (channel.id !== player.voiceChannel) {
            await message.reply("you're not in the same voice channel.");
            return;
        }
        if (!player.queue.current) {
            await message.reply("there is no music playing.");
            return;
        }
        player.queue.shuffle();
        await message.reply("Queue shuffled");
    },
};

export default shuffle;
