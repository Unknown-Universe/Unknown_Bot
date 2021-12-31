import { client } from "..";
import { db } from "../utilities/database";

client.on("guildDelete", async (guild) => {
    await db.execute("DELETE FROM `guilds` WHERE `id` = ?", [guild.id]);
});

client.on("messageDelete", async (message) => {
    await db.execute("DELETE FROM `reaction_roles` WHERE `message_id` = ?", [
        message.id,
    ]);
});

client.on("roleDelete", async (role) => {
    await db.execute("DELETE FROM `reaction_roles` WHERE `role_id` = ?", [
        role.id,
    ]);
});
