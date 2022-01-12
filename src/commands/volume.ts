import { manager } from "..";
import { Category } from "../catagories";
import { Command } from "../command";

const volume: Command = {
    name: "volume",
    category: Category.Music,
    description: "Used to change the volume of the bot",
    usage: "volume {number 1-100}",
    aliases: [],
    run: async (message, ...args) => {
        const player = manager.get(message.guild!.id);
        if (!player) {
            await message.reply("There is no player for this guild.");
            return;
        }
        const { channel } = message.member!.voice;
        if (!channel) {
            await message.reply("You need to join a voice channel.");
            return;
        }
        if (channel.id !== player.voiceChannel) {
            await message.reply("You're not in the same voice channel.");
            return;
        }
        const volume = Number(args[0]);

        if (!volume || volume < 1 || volume > 100) {
            await message.reply("Please give a volume between 1 and 100.");
            return;
        }

        player.setVolume(volume);
        await message.reply(`Set the bots volume to \`${volume}\`.`);
        return;
    },
};

export default volume;
