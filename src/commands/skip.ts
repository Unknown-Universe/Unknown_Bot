import { manager } from "..";
import { Category } from "../catagories";
import { Command } from "../command";

const skip: Command = {
    name: "skip",
    category: Category.Music,
    description: "Used to skip the current song in the queue",
    useage: "skip",
    run: async (message, ...args) => {
        const player = manager.get(message.guild!.id);
        if (!player) {
            await message.reply("there is no player for this guild.");
            return;
        }
        const { channel } = message.member!.voice;
        if (!channel) {
            await message.reply("you need to join a voice channel.");
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
        const { title } = player.queue.current;

        player.stop();
        await message.reply(`${title} was skipped.`);
        return;
    },
};

export default skip;
