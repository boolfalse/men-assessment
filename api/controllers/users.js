
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Link = require('../models/link');
const Referral = require('../models/referral');
const { testSecretKey, user_password } = require('../config/static-data');



module.exports = {
    register: asyncHandler(async (req, res) => {
        // query parameters are validated in the middleware
        const { name, email, password, referral_key } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists!'
            });
        }

        const salt = await bcrypt.genSalt(user_password.salt_rounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const regUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (referral_key) {
            const link = await Link.findOne({
                referral_key,
            });

            if (link) {
                await Referral.create({
                    user: regUser._id, // the registered user
                    link: link._id, // the link that was used
                });
            }
        }

        return res.status(201).json({
            success: true,
            data: {
                id: regUser._id,
                name: regUser.name,
                email: regUser.email,
            },
            message: 'User created successfully.',
        });
    }),
    login: asyncHandler(async (req, res) => {
        // query parameters are validated in the middleware
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User does not exist!'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect password!'
            });
        }

        const secretKey = process.env.SECRET_KEY || testSecretKey;
        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1d' });

        return res.status(200).json({
            success: true,
            data: {
                token,
                id: user._id,
                name: user.name,
                email: user.email,
            },
            message: 'User logged in successfully.',
        });
    }),
    profile: asyncHandler(async (req, res) => {
        // const user = await User.findById(req.user.id).select('-password');
        return res.status(200).json({
            success: true,
            data: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                isAdmin: req.user.isAdmin,
            },
            message: 'User profile retrieved successfully.',
        });
    }),
}
