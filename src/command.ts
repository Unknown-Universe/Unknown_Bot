import { Message } from "discord.js";
import { Category } from "./catagories";

export interface Command {
    name: string;
    description: string;
    category: Category;
    run: (message: Message, ...args: string[]) => Promise<void>;
}
