import { Category } from "../types/catagories";
import { Command } from "../types/command";
import {
    embedColor,
    invalidRoleMessage,
    invalidUsageMessage,
    invalidUserMessage,
    permissionMessage,
} from "../utilities/constants";
import { fetchGuild } from "../utilities/database";

const Role: Command = {
    name: "role",
    category: Category.Moderation,
    description: "Used to give a user a role",
    usage: "<user> <Role>",
    aliases: [],
    run: async (message, user, role) => {
        if (!message.member!.permissions.has("MANAGE_ROLES")) {
            await message.reply(permissionMessage);
            return;
        }
        if (!user.length || !role.length) {
            await message.reply(invalidUsageMessage);
            return;
        }

        if (!(await message.guild!.members.fetch()).has(user)) {
            await message.reply(invalidUserMessage);
            return;
        }
        if (!(await message.guild!.roles.fetch()).has(role)) {
            await message.reply(invalidRoleMessage);
            return;
        }

        const fetchedUser = message.guild!.members.cache.get(user)!;

        const fetchedRole = message.guild!.roles.cache.get(role)!;

        await fetchedUser.roles.add(fetchedRole!);
        message.reply(`Gave ${fetchedUser}: ${fetchedRole}`);
        const guild = message.guild!;

        const guildInfo = await fetchGuild(guild.id);
        if (guildInfo.do_moderation_logging) {
            const channel = guild.channels.cache.get(
                guildInfo.message_logging_channel
            );
            if (channel!.isText()) {
                await channel.send({
                    embeds: [
                        {
                            color: embedColor,
                            title: `User Given Role`,
                            fields: [
                                {
                                    name: "User:",
                                    value: fetchedUser.user.username,
                                },
                                {
                                    name: "User Id:",
                                    value: fetchedUser.id,
                                },
                                {
                                    name: "Role:",
                                    value: fetchedRole!.name,
                                },
                                {
                                    name: "Time:",
                                    value: `<t:${Math.floor(
                                        Date.now() / 1000
                                    )}>`,
                                },
                            ],
                        },
                    ],
                });
            }
        }
    },
};

export default Role;
