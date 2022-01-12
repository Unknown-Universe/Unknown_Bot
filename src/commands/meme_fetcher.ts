import { TextChannel } from "discord.js";
import RedditImageFetcher from "reddit-image-fetcher";
import { Category } from "../catagories";
import { Command } from "../command";
import { embedColor } from "../utilities/constants";

interface Meme {
    title: string;
    id: string;
    type: string;
    postLink: string;
    image: string;
    thumbnail: string;
    subreddit: string;
    NSFW: boolean;
    spoiler: boolean;
    createdUtc: number;
    upvotes: number;
    upvoteRatio: number;
}

async function fetchMeme(): Promise<Meme> {
    return (
        await RedditImageFetcher.fetch({
            type: "custom",
            subreddit: ["memes", "meme"],
        })
    )[0];
}

const meme: Command = {
    name: "meme",
    category: Category.Entertainment,
    description: "Fetches the newest memes, all from r/meme and r/memes",
    usage: "meme",
    aliases: [],
    run: async (message) => {
        let meme: Meme;
        do {
            meme = await fetchMeme();
        } while (meme.NSFW && !(message.channel as TextChannel).nsfw);

        await message.reply({
            embeds: [
                {
                    title: meme.title,
                    color: embedColor,
                    image: { url: meme.image },
                    fields: [{ name: "Post Link:", value: meme.postLink }],
                    footer: {
                        text: `r/${meme.subreddit} • Upvotes: ${meme.upvotes}`,
                    },
                },
            ],
        });
    },
};

export default meme;
