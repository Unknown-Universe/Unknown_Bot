import { EmbedFieldData, MessageOptions } from "discord.js";
import { embedColor } from "./constants";

export interface EmbedOptions {
    author?: string;
    icon?: string;
    title?: string;
    description?: string;
    fields?: EmbedFieldData[];
    footer?: string;
}

export function embed(options: EmbedOptions): MessageOptions {
    return {
        embeds: [
            {
                title: options.title,
                color: embedColor,
                author:
                    options.author || options.icon
                        ? {
                              name: options.author,
                              icon_url: options.icon,
                          }
                        : undefined,
                description: options.description,
                fields: options.fields,
                footer: options.footer
                    ? {
                          text: options.footer,
                      }
                    : undefined,
            },
        ],
    };
}
