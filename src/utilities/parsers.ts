import { Message, VoiceBasedChannel } from "discord.js";

export function parseUserId(text: string): string | null {
    return text.match(/^<@!?(\d{17,19})>$/)?.[1] ?? null;
}
export function parseChannelId(text: string): string | null {
    return text.match(/^<#(\d{17,19})>$/)?.[1] ?? null;
}
export function parseRoleId(text: string): string | null {
    return text.match(/^<@&(\d{17,19})>$/)?.[1] ?? null;
}

export function voiceChannelPermissionCheck(
    channel: VoiceBasedChannel,
    message: Message
): boolean {
    return (
        channel!.members.size !== 2 ||
        !message.member!.roles.cache.filter(
            (role) => role.name.toLowerCase() === "dj"
        ) ||
        !message.member!.permissions.has("MANAGE_MESSAGES")
    );
}
