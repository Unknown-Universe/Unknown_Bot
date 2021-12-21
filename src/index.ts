import { Client } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Command } from "./command";
import { fetchGuild, GuildModel } from "./database";
import { ReactionModel } from "./reactionDatabase";

dotenv.config();

export const client = new Client({
    intents: 32767,
    partials: ["CHANNEL", "MESSAGE", "REACTION"],
});

const commandDir = path.join(__dirname, "commands");
export const commands: Array<Command> = [];

for (const file of fs.readdirSync(commandDir)) {
    if (!file.endsWith(".js")) continue;
    commands.push(require(path.join(commandDir, file)).default as Command);
}

client.once("ready", async () => {
    console.log("Bot Online");
    client.user!.setActivity({ type: "WATCHING", name: "Over Your Servers" });
});

client.on("messageCreate", async (message) => {
    try {
        if (!message.guild || message.author.bot) {
            return;
        }

        const prefix = (await fetchGuild(message.guildId!)).prefix;

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
        } else return;

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

        if (!command) return;
        await command.run(message, ...args);
    } catch (error) {
        message.reply(`Unknown Error ${error}`);
        console.error(error);
        return;
    }
});

client.on("guildDelete", async (guild) => {
    await GuildModel.deleteMany({ id: guild.id });
});

client.on("messageReactionAdd", async (messageReaction, user) => {
    if (user.bot) return;

    const guild = messageReaction.message.guild;
    if (!guild) return;

    const member = await guild.members.fetch(user.id);

    const emoji = messageReaction.emoji;
    const reaction = await ReactionModel.findOne({
        messageID: messageReaction.message.id,
        emojiID: emoji.identifier,
    });

    if (reaction) {
        await member.roles.add(reaction.roleID).catch(() => {});
    }
});

client.on("messageReactionRemove", async (messageReaction, user) => {
    if (user.bot) return;

    const guild = messageReaction.message.guild;
    if (!guild) return;

    if (messageReaction.count === 0) {
        await ReactionModel.deleteMany({
            messageID: messageReaction.message.id,
            emojiID: messageReaction.emoji.identifier,
        });
        return;
    }

    const member = await guild.members.fetch(user.id);

    const emoji = messageReaction.emoji;
    const reaction = await ReactionModel.findOne({
        messageID: messageReaction.message.id,
        emojiID: emoji.identifier,
    });

    if (reaction) {
        await member.roles.remove(reaction.roleID).catch(() => {});
    }
});

client.on("messageDelete", async (message) => {
    await ReactionModel.deleteMany({ messageID: message.id });
});

client.on("roleDelete", async (role) => {
    await ReactionModel.deleteMany({ roleID: role.id });
});

client.on("guildMemberAdd", async (member) => {
    const guildInfo = await fetchGuild(member.guild.id);

    if (guildInfo.setAutoRole && !member.user.bot) {
        await member.roles.add(guildInfo.autoRole);
    }

    if (guildInfo.sendWelcome) {
        const channel = await member.guild.channels.fetch(
            guildInfo.welcomeChannel
        );

        if (channel?.isText()) {
            await channel!.send(
                guildInfo.welcomeMessage.replace(
                    /\{user\}/g,
                    `<@${member.user.id}>`
                )
            );
        }
    }
});

client.login(process.env.TOKEN);
