import { manager } from "..";
import { Category } from "../catagories";
import { Command } from "../command";

const volume: Command = {
    name: "volume",
    category: Category.Music,
    description: "Used to change the volume of the bot",
    useage: "volume {number 1-100}",
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
        const volume = Number(args[0]);

        if (!volume || volume < 1 || volume > 100) {
            await message.reply(
                "you need to give me a volume between 1 and 100."
            );
            return;
        }

        player.setVolume(volume);
        await message.reply(`set the player volume to \`${volume}\`.`);
        return;
    },
};

export default volume;
