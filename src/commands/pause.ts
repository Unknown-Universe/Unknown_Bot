import { manager } from "..";
import { Category } from "../types/catagories";
import { Command } from "../types/command";
import {
    invalidUserVoiceChannelMessage,
    noPlayerInGuild,
    voiceChannelPermissionMessage,
} from "../utilities/constants";
import { voiceChannelPermissionCheck } from "../utilities/parsers";

const pause: Command = {
    name: "pause",
    category: Category.Music,
    description: "Used to pause the current music playing",
    usage: "pause",
    aliases: [],
    run: async (message, ...args) => {
        const player = manager.get(message.guild!.id);
        if (!player) {
            return await message.reply(noPlayerInGuild);
        }

        const { channel } = message.member!.voice;

        if (!channel) {
            return message.reply(invalidUserVoiceChannelMessage);
        }

        if (voiceChannelPermissionCheck(channel!, message))
            return await message.reply(voiceChannelPermissionMessage);

        if (channel.id !== player.voiceChannel) {
            return await message.reply(invalidUserVoiceChannelMessage);
        }
        if (player.paused) {
            return await message.reply("The music is already paused.");
        }
        player.pause(true);
        return await message.reply("Paused the music.");
    },
};

export default pause;
