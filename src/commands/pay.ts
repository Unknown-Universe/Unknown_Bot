import { Category } from "../catagories";
import { Command } from "../command";
import { db, fetchUser } from '../utilities/database';
import { parseUserId } from "../utilities/parsers";

const pay: Command = {
    name: "pay",
    category: Category.Entertainment,
    description: "Send funds to another user",
    useage: "pay {user} {amount}",
    run: async (message, ...args) => {
        const receiveUserId =
            parseUserId(args[0]) ?? args[0].match(/^(\d{17,19})$/)?.[1];

        const sendUser = message.member!;

        const sendUserInfo = await fetchUser(sendUser.id);

        if (!receiveUserId) {
            await message.reply("Please give a actual user to send to");
            return;
        }

        const receiveUserInfo = await fetchUser(receiveUserId);
        const amount = +args[1];

        if (!amount || amount < 1) {
            await message.reply("Please give a vaild amount");
            return;
        }

        if (sendUserInfo.balance < amount) {
            await message.reply("You cant send more then you have");
            return;
        }

        receiveUserInfo.balance += amount;
        sendUserInfo.balance -= amount;
        await db.execute('UPDATE `users` SET `balance` = ? WHERE `id` = ?', [receiveUserInfo.balance, receiveUserInfo.id]);
        await db.execute('UPDATE `users` SET `balance` = ? WHERE `id` = ?', [sendUserInfo.balance, sendUserInfo.id]);
    },
};

export default pay;
