
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');



module.exports = {
    userMiddleware: asyncHandler(async (req, res, next) => {
        const bearerToken = req.headers?.authorization;
        if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized!',
            });
        }

        try {
            const token = bearerToken.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);

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
                isAdmin: false,
            };
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized!',
            });
        }
    }),
    adminMiddleware: asyncHandler(async (req, res, next) => {
        const token = req.cookies?.admin_token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized!',
            });
        }

        try {
            const secretKey = process.env.SECRET_KEY || 'SecretKeyForEncryption';
            const decoded = jwt.verify(token, secretKey);

            const admin_user = await User.findById(decoded.id).select('-password');
            if (!admin_user || !admin_user.isAdmin) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized!',
                });
            }

            req.user = {
                id: admin_user._id,
                name: admin_user.name,
                email: admin_user.email,
                isAdmin: true,
            };
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized!',
            });
        }
    }),
};
