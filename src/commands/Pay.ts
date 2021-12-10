import { parseUserId } from "..";
import { Category } from "../catagories";
import { Command } from "../command";
import { fetchUser } from "../econDatabase";

const pay: Command = {
    name: "pay",
    category: Category.Entertainment,
    description: "Send funds to another user",
    useage: "pay {user} {amount}",
    run: async (message, ...args) => {
        const reciveUserId =
            parseUserId(args[0]) ?? args[0].match(/^(\d{17,19})$/)?.[1];

        const sendUser = message.member!;

        const sendUserInfo = await fetchUser(sendUser.id);

        if (!reciveUserId) {
            message.reply("Please give a actual user to send to");
            return;
        }

        const reciveUserInfo = await fetchUser(reciveUserId);
        const amount = +args[1];

        if (!amount || amount < 1) {
            message.reply("Please give a vaild amount");
            return;
        }

        if (sendUserInfo.balance < amount) {
            message.reply("You cant send more then you have");
            return;
        }

        reciveUserInfo.balance += amount;
        sendUserInfo.balance -= amount;
        reciveUserInfo.save();
        sendUserInfo.save();
    },
};

export default pay;
