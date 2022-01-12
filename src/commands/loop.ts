import { manager } from "..";
import { Category } from "../catagories";
import { Command } from "../command";

const loop: Command = {
    name: "loop",
    category: Category.Music,
    description: "loop",
    usage: "loop [queue]",
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

        if (args.length && /queue/i.test(args[0])) {
            player.setQueueRepeat(!player.queueRepeat);
            const queueRepeat = player.queueRepeat ? "enabled" : "disabled";
            await message.reply(`${queueRepeat} queue repeat.`);
            return;
        }

        player.setTrackRepeat(!player.trackRepeat);
        const trackRepeat = player.trackRepeat ? "enabled" : "disabled";
        await message.reply(`${trackRepeat} track repeat.`);
    },
};

export default loop;
