
const { check, validationResult } = require('express-validator');
const staticData = require('../config/static-data');

module.exports = {
    register: [
        check('name') // name validation
            .trim()
            .escape()
            .not()
            .isEmpty()
            .withMessage('Name can\'t be empty!')
            .bail()
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters!')
            .bail(),
        check('email') // email validation
            .trim()
            .not()
            .isEmpty()
            .withMessage('Email can\'t be empty!')
            .bail()
            .isEmail()
            .withMessage('Invalid email address!')
            .bail(),
        check('password') // password validation
            .trim()
            .not()
            .isEmpty()
            .withMessage('Password can\'t be empty!')
            .bail()
            .isLength({ min: 6, max: 20 })
            .withMessage('Password must be between 6 and 20 characters!')
            .bail(),
        check('referral_key') // referral key validation
            .optional()
            .trim()
            .isLength({ min: staticData.referral_key_length, max: staticData.referral_key_length })
            .withMessage(`Referral key must be ${staticData.referral_key_length} characters!`)
            .bail(),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const messages = errors.array().map(error => error.msg); // messages.join(' ')
                return res.status(422).json({
                    success: false,
                    messages,
                });
            }
            next();
        },
    ],
    login: [
        check('email') // email validation
            .trim()
            .not()
            .isEmpty()
            .withMessage('Email can\'t be empty!')
            .bail()
            .isEmail()
            .withMessage('Invalid email address!')
            .bail(),
        check('password') // password validation
            .trim()
            .not()
            .isEmpty()
            .withMessage('Password can\'t be empty!')
            .bail()
            .isLength({ min: 6, max: 20 })
            .withMessage('Password must be between 6 and 20 characters!')
            .bail(),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const messages = errors.array().map(error => error.msg); // messages.join(' ')
                return res.status(422).json({
                    success: false,
                    messages,
                });
            }
            next();
        },
    ],
};
