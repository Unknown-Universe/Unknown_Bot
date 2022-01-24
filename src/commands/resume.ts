import { manager } from "..";
import { Category } from "../types/catagories";
import { Command } from "../types/command";
import {
    invalidUserVoiceChannelMessage,
    noPlayerInGuild,
    voiceChannelPermissionMessage,
} from "../utilities/constants";
import { voiceChannelPermissionCheck } from "../utilities/parsers";

const resume: Command = {
    name: "resume",
    category: Category.Music,
    description: "used to restart the music",
    usage: "",
    aliases: ["unpause"],
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
        if (!player.paused) {
            await message.reply("The player is already resumed.");
            return;
        }

        player.pause(false);
        await message.reply("Resumed the player.");
        return;
    },
};

export default resume;
