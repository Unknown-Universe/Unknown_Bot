import { manager } from "..";
import { Category } from "../types/catagories";
import { Command } from "../types/command";
import {
    invalidUserVoiceChannelMessage,
    noPlayerInGuild,
    voiceChannelPermissionMessage,
} from "../utilities/constants";
import { voiceChannelPermissionCheck } from "../utilities/parsers";

const shuffle: Command = {
    name: "shuffle",
    category: Category.Music,
    description: "Used to shuffle the queue",
    usage: "",
    aliases: [],
    run: async (message, ...args) => {
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
        player.queue.shuffle();
        await message.reply("Queue shuffled");
    },
};

export default shuffle;
