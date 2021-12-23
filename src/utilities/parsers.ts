export function parseUserId(text: string): string | null {
    return text.match(/^<@!?(\d{17,19})>$/)?.[1] ?? null;
}
export function parseChannelId(text: string): string | null {
    return text.match(/^<#(\d{17,19})>$/)?.[1] ?? null;
}
export function parseRoleId(text: string): string | null {
    return text.match(/^<@&(\d{17,19})>$/)?.[1] ?? null;
}
