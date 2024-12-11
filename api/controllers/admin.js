
const asyncHandler = require('express-async-handler');
const User = require('../models/user');



module.exports = {
    getUsers: asyncHandler(async (req, res) => {
        try {
            const existingUsers = await User.find().select('-password');
            const users = existingUsers.map(user => ({
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            }));

            return res.status(200).json({
                success: true,
                data: users,
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message || err.toString(),
            });
        }
    }),
}
