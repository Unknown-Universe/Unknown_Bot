import { GuildMember, User } from "discord.js";
import { client } from "..";
import { Category } from "../types/catagories";
import { Command } from "../types/command";
import { embedColor, invalidUserMessage } from "../utilities/constants";
import { parseUserId } from "../utilities/parsers";

const Whois: Command = {
    name: "whois",
    category: Category.Information,
    description: "Get information on {user}",
    usage: "[user]",
    aliases: [],
    run: async (message, userPing) => {
        if (!userPing) {
            userPing = `<@${message.member!.user.id}>`;
        }

        const userID = parseUserId(userPing);

        if (!userID) {
            await message.reply(invalidUserMessage);
            return;
        }
        let user: User;
        try {
            user = await client.users.fetch(userID);
        } catch {
            await message.reply("Unknown user");
            return;
        }
        let member: GuildMember | null = null;
        try {
            member = await message.guild!.members.fetch(userID);
        } catch {}
        const flags = (await user.fetchFlags()).toArray().toString();

        await message.reply({
            embeds: [
                {
                    color: embedColor,
                    title: `Info on: ${user.username}#${user.discriminator}`,
                    image: { url: user.displayAvatarURL()! },
                    fields: [
                        {
                            name: `UserID:`,
                            value: user.id,
                        },
                        {
                            name: "Created:",
                            value: user.createdAt.toUTCString(),
                        },
                        ...(flags.length
                            ? [
                                  {
                                      name: "Flags:",
                                      value: flags,
                                  },
                              ]
                            : []),
                        ...(member
                            ? [
                                  {
                                      name: "Join Date:",
                                      value: member.joinedAt!.toUTCString(),
                                  },
                              ]
                            : []),
                    ],
                },
            ],
        });
    },
};

export default Whois;
