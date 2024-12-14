
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
            .isLength({ min: staticData.user_name.min_length, max: staticData.user_name.max_length })
            .withMessage(`Name must be between ${staticData.user_name.min_length} and ${staticData.user_name.max_length} characters!`)
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
            .isLength({ min: staticData.user_password.min_length, max: staticData.user_password.max_length })
            .withMessage(`Password must be between ${staticData.user_password.min_length} and ${staticData.user_password.max_length} characters!`)
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
                const messages = errors.array().map(error => error.msg);
                return res.status(422).json({
                    success: false,
                    message: messages.join(' '),
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
            .isLength({ min: staticData.user_password.min_length, max: staticData.user_password.max_length })
            .withMessage(`Password must be between ${staticData.user_password.min_length} and ${staticData.user_password.max_length} characters!`)
            .bail(),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const messages = errors.array().map(error => error.msg);
                return res.status(422).json({
                    success: false,
                    message: messages.join(' '),
                });
            }
            next();
        },
    ],
};
