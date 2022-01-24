import { manager } from "..";
import { Category } from "../types/catagories";
import { Command } from "../types/command";
import {
    invalidUserVoiceChannelMessage,
    noPlayerInGuild,
    voiceChannelPermissionMessage,
} from "../utilities/constants";
import { voiceChannelPermissionCheck } from "../utilities/parsers";

const stop: Command = {
    name: "stop",
    category: Category.Music,
    description: "Used to stop the music",
    usage: "",
    aliases: [],
    run: async (message) => {
        const player = manager.get(message.guild!.id);
        if (!player) {
            return await message.reply(noPlayerInGuild);
        }
        const { channel } = message.member!.voice;
        if (!channel) {
            return await message.reply(invalidUserVoiceChannelMessage);
        }

        if (voiceChannelPermissionCheck(channel!, message))
            return await message.reply(voiceChannelPermissionMessage);

        if (channel.id !== player.voiceChannel) {
            return await message.reply(invalidUserVoiceChannelMessage);
        }
        player.destroy();
        return await message.reply("Music Stoped");
    },
};

export default stop;
