import { Category } from "../catagories";
import { Command } from "../command";
import { fetchGuild } from "../utilities/database";
import { parseRoleId, parseUserId } from "../utilities/parsers";

const Role: Command = {
    name: "role",
    category: Category.Moderation,
    description: "Used to give {User} role {Role}",
    useage: "role {User} {Role}",
    run: async (message, ...args) => {
        if (!message.member!.permissions.has("MANAGE_ROLES")) {
            await message.reply("You dont have permission to do this");
            return;
        }
        if (!args.length) {
            await message.reply("Usage: role {User} {Role}");
            return;
        }

        const user = parseUserId(args[0])!;
        const role = parseRoleId(args[1])!;

        if (!(await message.guild!.members.fetch()).has(user)) {
            await message.reply("Please give a valid user");
            return;
        }
        if (!(await message.guild!.roles.fetch()).has(role)) {
            await message.reply("Please give a valid role");
            return;
        }
        const fetchedUser = await message.guild!.members.fetch(user);
        const fetchedRole = await message.guild!.roles.fetch(role);

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
