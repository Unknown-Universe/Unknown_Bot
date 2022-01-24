import { manager } from "..";
import { Category } from "../types/catagories";
import { Command } from "../types/command";
import {
    invalidUserVoiceChannelMessage,
    noPlayerInGuild,
    voiceChannelPermissionMessage,
} from "../utilities/constants";
import { voiceChannelPermissionCheck } from "../utilities/parsers";

const remove: Command = {
    name: "remove",
    category: Category.Music,
    description: "Removed a song from the queue",
    usage: "<index>",
    aliases: [""],
    run: async (message, songIndex) => {
        const player = manager.get(message.guild!.id);
        if (!player) {
            await message.reply(noPlayerInGuild);
            return;
        }

        const { channel } = message.member!.voice;

        if (!channel) {
            message.reply(invalidUserVoiceChannelMessage);
            return;
        }

        if (voiceChannelPermissionCheck(channel!, message))
            return await message.reply(voiceChannelPermissionMessage);

        if (channel.id !== player.voiceChannel) {
            await message.reply(invalidUserVoiceChannelMessage);
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
