
const { seeds } = require('../config/static-data');
const User = require('../models/user');
const bcrypt = require("bcryptjs");
const staticData = require("../config/static-data");



const seedUsers = async () => {
    const { success, users, message } = await getNonExistingUsers();
    if (!success || !users || !users.length) {
        console.error(message || 'No users to seed!');
        return;
    }

    try {
        for (let user of users) {
            const salt = await bcrypt.genSalt(staticData.password_salt_rounds);
            const password = await bcrypt.hash(user.plain_password, salt);

            await User.create({
                isAdmin: user.isAdmin || false,
                name: user.name,
                email: user.email,
                password,
            });
        }
    } catch (err) {
        console.error(err.message || err.toString());
    }
}

const getNonExistingUsers = async () => {
    try {
        const nonExistingUsers = [];
        for (let user of seeds.users) {
            const foundUser = await User.findOne({
                email: user.email,
            });

            if (!foundUser) {
                nonExistingUsers.push(user);
            }
        }

        return {
            success: true,
            users: nonExistingUsers,
        };
    } catch (err) {
        return {
            success: false,
            message: err.message || err.toString(),
        };
    }
}

module.exports = seedUsers;
