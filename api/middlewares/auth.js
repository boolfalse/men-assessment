
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');



const auth = asyncHandler(async (req, res, next) => {
    const bearerToken = req.headers?.authorization;
    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized!',
        });
    }

    try {
        const token = bearerToken.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized!',
            });
        }

        req.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        };
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized!',
        });
    }
});

module.exports = auth;
