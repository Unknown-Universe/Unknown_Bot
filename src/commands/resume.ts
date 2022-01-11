import { manager } from "..";
import { Category } from "../catagories";
import { Command } from "../command";

const resume: Command = {
    name: "resume",
    category: Category.Music,
    description: "used to restart the music",
    useage: "resume",
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
        if (!player.paused) {
            await message.reply("the player is already resumed.");
            return;
        }

        player.pause(false);
        await message.reply("resumed the player.");
        return;
    },
};

export default resume;
