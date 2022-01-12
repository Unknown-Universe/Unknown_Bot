import { Message } from "discord.js";
import { client, commands } from "..";
import { Category } from "../catagories";
import { calc } from "../utilities/calculator";
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
            await filter(message, guildData);
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
            (command) =>
                command.name.toLowerCase() === name.toLowerCase() ||
                command.aliases.includes(name.toLowerCase())
        );

        if (
            !command ||
            (command.category === Category.Restricted &&
                !(process.env.DEVELOPER_USERS ?? "")
                    .split(/\s*,\s*/)
                    .includes(message.author.id))
        ) {
            await filter(message, guildData);
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
                return;
            }
        }
    }
    await counting(message, guildData);
}

async function counting(message: Message, guildInfo: GuildData) {
    if (
        !guildInfo.do_counting ||
        message.channel.id !== guildInfo.counting_channel
    ) {
        return;
    }

    const currentNumber = guildInfo.counting_number;
    if (calc(message.content) !== currentNumber) {
        await message.delete();
        return;
    }
    await db.execute(
        "UPDATE `guilds` SET `counting_number` = ? WHERE `id` = ?",
        [(currentNumber + 1).toString(), message.guild!.id]
    );
    await message.react("✅");
}
