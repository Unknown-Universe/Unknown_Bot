import ms from "ms";
import { Category } from "../catagories";
import { Command } from "../command";
import { fetchUser } from "../econDatabase";

const timeouts: Record<string, number> = {};

const work: Command = {
    name: "work",
    category: Category.Entertainment,
    description: "Work for your funds",
    useage: "work",
    run: async (message, ...args) => {
        if (message.member!.user.id in timeouts) {
            if (
                Date.now() - timeouts[message.member!.user.id] <
                1000 * 60 * 45
            ) {
                await message.reply(
                    `You cant run this command for another ${ms(
                        1000 * 60 * 45 -
                            (Date.now() - timeouts[message.member!.user.id]),
                        { long: true }
                    )}`
                );
                return;
            }
        }
        timeouts[message.member!.user.id] = Date.now();

        const user = message.member!;

        const data = fetchUser(user.id);

        const random = Math.floor(Math.random() * 50);

        (await data).balance += random;
        message.reply(`You made ${random} working today`);
        (await data).save();
    },
};

export default work;
