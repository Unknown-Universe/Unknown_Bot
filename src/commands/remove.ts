import { manager } from "..";
import { Category } from "../catagories";
import { Command } from "../command";

const remove: Command = {
    name: "remove",
    category: Category.Music,
    description: "remove",
    usage: "remove {index}",
    aliases: [],
    run: async (message, songIndex) => {
        const player = manager.get(message.guild!.id);
        if (!player) {
            await message.reply("there is no player for this guild.");
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
        const index = +songIndex;
        if (!index || index < 1 || index > player.queue.length) {
            await message.reply(
                `Please give a number between 1 and ${player.queue.length}`
            );
            return;
        }
        const { title } = player.queue[index - 1];
        player.queue.remove(index - 1);
        await message.reply(`Removed ${title} at position ${index}`);
    },
};

export default remove;
