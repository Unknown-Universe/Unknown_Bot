import { client } from "..";
import { db, ReactionRoleData } from "../utilities/database";

client.on("messageReactionAdd", async (messageReaction, user) => {
    try {
        if (user.bot) return;

        const guild = messageReaction.message.guild;
        if (!guild) return;

        const member = await guild.members.fetch(user.id);

        const emoji = messageReaction.emoji;

        const [[reaction]]: [ReactionRoleData[]] = (await db.execute(
            "SELECT * FROM `reaction_roles` WHERE `message_id` = ? AND `emoji_id` = ?",
            [messageReaction.message.id, emoji.id ?? emoji.name]
        )) as any;

        if (reaction) {
            await member.roles.add(reaction.role_id).catch(() => {});
        }
    } catch (error) {
        console.log(error);
    }
});

client.on("messageReactionRemove", async (messageReaction, user) => {
    try {
        if (user.bot) return;

        const guild = messageReaction.message.guild;
        if (!guild) return;

        if (messageReaction.count === 0) {
            await db.execute(
                "DELETE FROM `reaction_roles` WHERE `message_id` = ? AND `emoji_id` = ?",
                [
                    messageReaction.message.id,
                    messageReaction.emoji.id ?? messageReaction.emoji.name,
                ]
            );
            return;
        }

        const member = await guild.members.fetch(user.id);

        const emoji = messageReaction.emoji;
        const [[reaction]]: [ReactionRoleData[]] = (await db.execute(
            "SELECT * FROM `reaction_roles` WHERE `message_id` = ? AND `emoji_id` = ?",
            [messageReaction.message.id, emoji.id ?? emoji.name]
        )) as any;

        if (reaction) {
            await member.roles.remove(reaction.role_id).catch(() => {});
        }
    } catch (error) {
        console.log(error);
    }
});
