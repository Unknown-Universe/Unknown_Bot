import { Category } from "../catagories";
import { Command } from "../command";
import { fetchUser } from '../utilities/database';

const bal: Command = {
    name: "bal",
    category: Category.Entertainment,
    description: "Get your current ballance",
    useage: "bal",
    run: async (message, ...args) => {
        const user = message.member!;

        const data = await fetchUser(user.id);
        await message.reply(
            `Your current Ballance is: ${data.balance}`
        );
    },
};

export default bal;
