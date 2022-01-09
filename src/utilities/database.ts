import dotenv from "dotenv";
import { createPool } from "mysql2";
dotenv.config();

export const db = createPool({
    host: process.env.DATABASE_HOST ?? "localhost",
    user: process.env.DATABASE_USER ?? "root",
    database: process.env.DATABASE_NAME ?? "unknownbot",
    password: process.env.DATABASE_PASS,
    port: process.env.DATABASE_PORT as any,
    supportBigNumbers: true,
    bigNumberStrings: true,
    charset: "utf8mb4_unicode_ci",
}).promise();

export interface GuildData {
    id: string;
    prefix: string;
    send_welcome: boolean;
    welcome_channel: string | null;
    welcome_message: string;
    auto_role: string | null;
    set_auto_role: boolean;
    do_filter: boolean;
    show_total_count: boolean;
    show_bot_count: boolean;
    show_user_count: boolean;
    user_count_channel_id: string;
    bot_count_channel_id: string;
    total_count_channel_id: string;
    user_count: number;
    bot_count: number;
    total_count: number;
    do_message_logging: boolean;
    message_logging_channel: string;
    do_moderation_logging: boolean;
    counting_channel: string;
    do_counting: boolean;
    counting_number: number;
}

export interface UserData {
    id: string;
    balance: number;
}

export interface ReactionRoleData {
    message_id: string;
    role_id: string;
    emoji_id: string;
}

export interface FilteredWordData {
    guild_id: string;
    word: string;
}

export async function fetchGuild(id: string): Promise<GuildData> {
    const [results]: [GuildData[]] = (await db.execute(
        "SELECT * FROM `guilds` WHERE `id` = ?",
        [id]
    )) as any;
    if (results.length) return results[0];
    await db.execute("INSERT INTO `guilds` (`id`) VALUES (?)", [id]);
    return await fetchGuild(id);
}

export async function fetchUser(id: string): Promise<UserData> {
    const [results]: [UserData[]] = (await db.execute(
        "SELECT * FROM `users` WHERE `id` = ?",
        [id]
    )) as any;
    if (results.length) return results[0];
    await db.execute("INSERT INTO `users` (`id`) VALUES (?)", [id]);
    return await fetchUser(id);
}
