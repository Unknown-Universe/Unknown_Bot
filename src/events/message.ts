import { Message } from "discord.js";
import { client, commands } from "..";
import {
    db,
    fetchGuild,
    FilteredWordData,
    GuildData,
} from "../utilities/database";

client.on("messageCreate", async (message) => {
    try {
        if (!message.guild || message.author.bot) {
            return;
        }
        const guildData = await fetchGuild(message.guildId!);
        const prefix = guildData.prefix;

        const ping = `<@${client.user!.id}>`;
        const nick = `<@!${client.user!.id}>`;
        let text = message.content;
        let mentioned: boolean;

        if (text.startsWith(prefix)) {
            text = text.slice(prefix.length).trimStart();
            mentioned = false;
        } else if (text.startsWith(ping)) {
            text = text.slice(ping.length).trimStart();
            mentioned = true;
        } else if (text.startsWith(nick)) {
            text = text.slice(nick.length).trimStart();
            mentioned = true;
        } else {
            filter(message, guildData);
            return;
        }

        const [name, ...args] = text.split(" ");
        if (!name.length) {
            if (mentioned) {
                await message.reply(`This servers prefix is ${prefix}`);
            }
            return;
        }
        const command = commands.find(
            (command) => command.name.toLowerCase() === name.toLowerCase()
        );

        if (!command) {
            filter(message, guildData);
            return;
        }
        await command.run(message, ...args);
    } catch (error) {
        message.reply(`Unknown Error ${error}`);
        console.error(error);
        return;
    }
});

async function filter(message: Message, guildData: GuildData) {
    if (guildData.do_filter) {
        const [filterWords]: [FilteredWordData[]] = (await db.execute(
            "SELECT * FROM `filtered_words` WHERE `guild_id` = ?",
            [message.guildId]
        )) as any;
        for (const word of filterWords) {
            if (message.content.includes(word.word)) {
                await message.delete();
                try {
                    const dm = await message.member!.user.createDM();
                    await dm.send(
                        `The word ${word.word} is banned in ${
                            message.guild!.name
                        }`
                    );
                } catch {
                    await message.channel.send(
                        `${message.member!.user} that word is not allowed here`
                    );
                }
                break;
            }
        }
    }
}
