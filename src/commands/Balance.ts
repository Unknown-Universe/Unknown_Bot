import { Category } from "../catagories";
import { Command } from "../command";
import { fetchUser } from "../econDatabase";

const bal: Command = {
    name: "Bal",
    category: Category.Entertainment,
    description: "Get your current ballance",
    useage: "bal",
    run: async (message, ...args) => {
        const user = message.member!;

        const data = fetchUser(user.id);
        await message.reply(
            `Your current Ballance is: ${(await data).balance}`
        );
    },
};

export default bal;
