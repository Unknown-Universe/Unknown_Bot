import { manager } from "..";
import { Category } from "../catagories";
import { Command } from "../command";

const shuffle: Command = {
    name: "shuffle",
    category: Category.Music,
    description: "Used to shuffle the queue",
    usage: "shuffle",
    aliases: [],
    run: async (message, ...args) => {
        const player = manager.get(message.guild!.id);
        if (!player) {
            await message.reply("There is no player for this guild.");
            return;
        }

        const { channel } = message.member!.voice;

        if (!channel) {
            message.reply("You need to join a voice channel.");
            return;
        }
        if (channel.id !== player.voiceChannel) {
            await message.reply("You're not in the same voice channel.");
            return;
        }
        if (!player.queue.current) {
            await message.reply("There is no music playing.");
            return;
        }
        player.queue.shuffle();
        await message.reply("Queue shuffled");
    },
};

export default shuffle;
