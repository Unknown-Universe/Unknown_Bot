import { manager } from "..";
import { Category } from "../catagories";
import { Command } from "../command";

const pause: Command = {
    name: "pause",
    category: Category.Music,
    description: "Used to pause the current music playing",
    usage: "pause",
    aliases: [],
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
        if (player.paused) {
            await message.reply("the player is already paused.");
            return;
        }
        player.pause(true);
        await message.reply("paused the player.");
        return;
    },
};

export default pause;
