
const asyncHandler = require('express-async-handler');
const Link = require('../models/link');
const Referral = require('../models/referral');
const staticData = require('../config/static-data');



module.exports = {
    all: asyncHandler(async (req, res) => {
        try {
            const links = await Link.find({
                user: req.user.id,
            });

            const linksWithReferralEndpoints = links.map(link => {
                return {
                    id: link._id,
                    referral_key: link.referral_key,
                    referral_endpoint: `${process.env.BASE_URL}:${process.env.PORT}/api/links/${link.referral_key}`
                };
            });

            return res.status(200).json({
                success: true,
                data: linksWithReferralEndpoints,
                message: 'Links'
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message || err.toString(),
            });
        }
    }),
    create: asyncHandler(async (req, res) => {
        try {
            const link = await Link.create({
                user: req.user.id,
            });

            return res.status(201).json({
                success: true,
                data: {
                    referral_key: link.referral_key,
                    referral_endpoint: `${process.env.BASE_URL}:${process.env.PORT}/api/links/${link.referral_key}`
                },
                message: 'Link created successfully.'
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message || err.toString(),
            });
        }
    }),
    referral: asyncHandler(async (req, res) => {
        try {
            const referral_key = req.params?.referral_key;
            const referralKeyRegex = new RegExp(`^[0-9a-f]{${staticData.referral_key_length}}$`);
            if (!referralKeyRegex.test(referral_key)) {
                return res.status(404).json({
                    success: false,
                    message: `Referral key is invalid!`
                });
            }

            const link = await Link.findOne({
                referral_key,
            });
            if (!link) {
                return res.status(404).json({
                    success: false,
                    message: `Link not found!`
                });
            }

            const count = await Referral.countDocuments({
                link: link._id,
            });

            return res.status(200).json({
                success: true,
                data: {
                    used: count,
                },
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message || err.toString(),
            });
        }
    }),
}
