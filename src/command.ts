import { Message } from "discord.js";
import { Category } from "./catagories";

export interface Command {
    name: string; //names the command
    description: string; //Used in help command to describe what it does
    category: Category; //Used in help command to group it in like commands
    useage: string; //Used in help command to explain how to use command
    run: (message: Message, ...args: string[]) => Promise<void>; //Command content
}
