import { Message } from "discord.js";

enum Category {
    Moderation,
    Utilities,
    Configuration,
    Information,
    Entertainment,
}

interface Command {
    name: string;
    description: string;
    category: Category;
    run: (message: Message, ...args: string[]) => Promise<void>;
}

const help: Command = {
    name: "help",
    description: "Shows a list of commands.",
    category: Category.Moderation,
    run: async (message, ...args) => {},
};
