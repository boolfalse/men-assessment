
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Link = require('../models/link');
const Referral = require('../models/referral');
const staticData = require('../config/static-data');



module.exports = {
    register: asyncHandler(async (req, res) => {
        const { name, email, password, referral_key } = req.body;
        if (!name || !email || !password) {
            return res.status(422).json({
                success: false,
                message: 'Name, email and password are required!'
            });
        }

        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(String(email).toLowerCase())) {
            return res.status(422).json({
                success: false,
                message: 'Invalid email!'
            });
        }
        if (password.length < staticData.password_min_length || password.length > staticData.password_max_length) {
            return res.status(422).json({
                success: false,
                message: `Password must be between ${staticData.password_min_length} and ${staticData.password_max_length} characters!`
            });
        }
        if (referral_key && referral_key.length !== staticData.referral_key_length) {
            return res.status(401).json({
                success: false,
                message: 'Invalid referral key!'
            });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists!'
            });
        }

        const salt = await bcrypt.genSalt(staticData.password_salt_rounds);
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
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({
                success: false,
                message: 'Email and password are required!'
            });
        }

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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '30d',
        });

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
            },
            message: 'User profile retrieved successfully.',
        });
    }),
}
