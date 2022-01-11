import { manager } from "..";
import { Category } from "../catagories";
import { Command } from "../command";

const stop: Command = {
    name: "stop",
    category: Category.Music,
    description: "Used to stop the music",
    useage: "stop",
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
        player.destroy();
        await message.reply("Music Stoped");
        return;
    },
};

export default stop;
