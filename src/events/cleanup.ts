import { client } from "..";
import { db } from "../utilities/database";

client.on("guildDelete", async (guild) => {
    try {
        await db.execute("DELETE FROM `guilds` WHERE `id` = ?", [guild.id]);
    } catch (error) {
        console.log(error);
    }
});

client.on("messageDelete", async (message) => {
    try {
        await db.execute(
            "DELETE FROM `reaction_roles` WHERE `message_id` = ?",
            [message.id]
        );
    } catch (error) {
        console.log(error);
    }
});

client.on("roleDelete", async (role) => {
    try {
        await db.execute("DELETE FROM `reaction_roles` WHERE `role_id` = ?", [
            role.id,
        ]);
    } catch (error) {
        console.log(error);
    }
});
