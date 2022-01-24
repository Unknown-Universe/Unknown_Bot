import { manager } from "..";
import { Category } from "../types/catagories";
import { Command } from "../types/command";
import {
    invalidUserVoiceChannelMessage,
    noPlayerInGuild,
    voiceChannelPermissionMessage,
} from "../utilities/constants";
import { voiceChannelPermissionCheck } from "../utilities/parsers";

const volume: Command = {
    name: "volume",
    category: Category.Music,
    description: "Used to change the volume of the bot",
    usage: "<number 1-100>",
    aliases: [],
    run: async (message, ...args) => {
        const player = manager.get(message.guild!.id);
        if (!player) {
            await message.reply(noPlayerInGuild);
            return;
        }
        const { channel } = message.member!.voice;
        if (!channel) {
            await message.reply(invalidUserVoiceChannelMessage);
            return;
        }

        if (voiceChannelPermissionCheck(channel!, message))
            return await message.reply(voiceChannelPermissionMessage);

        if (channel.id !== player.voiceChannel) {
            await message.reply(invalidUserVoiceChannelMessage);
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
