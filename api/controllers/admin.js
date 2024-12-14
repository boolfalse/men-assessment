
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const validate = require('../validations/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { testSecretKey } = require('../config/static-data');



module.exports = {
    login: asyncHandler(async (req, res) => {
        // query parameters are validated in the middleware
        const { email, password } = req.body;

        const admin_user = await User.findOne({ email, isAdmin: true });
        if (!admin_user) {
            return res.status(400).json({
                success: false,
                message: 'Admin does not exist!'
            });
        }

        const isMatch = await bcrypt.compare(password, admin_user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect password!'
            });
        }

        const secretKey = process.env.SECRET_KEY || testSecretKey;
        const token = jwt.sign({ id: admin_user._id }, secretKey, { expiresIn: '1d' });

        req.session.admin_token = token;
        res.cookie('admin_token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        return res.status(200).json({
            success: true,
            data: {
                id: admin_user._id,
                name: admin_user.name,
                email: admin_user.email,
            },
            message: 'Admin logged in successfully.',
        });
    }),
    getUsers: asyncHandler(async (req, res) => {
        // validate and sanitize the query parameters
        const { filteredData, errMessage } = validate.getUsers(req.query);
        if (errMessage) {
            return res.status(403).json({
                success: false,
                message: errMessage,
            });
        }

        try {
            const findData = filteredData.term ? {
                $or: [
                    { name: { $regex: filteredData.term, $options: 'i' } },
                    { email: { $regex: filteredData.term, $options: 'i' } },
                ],
            } : {};

            const users = await User.find(findData)
                .select('id name email isAdmin')
                .skip((filteredData.page - 1) * filteredData.per)
                .limit(filteredData.per);
            const count = await User
                .find(findData)
                .countDocuments();

            // Pagination
            let total = Math.ceil(count / filteredData.per);
            let prev = filteredData.page - 1;
            if (prev <= 0 || (filteredData.page * filteredData.per <= count && filteredData.page === 1)) {
                prev = '';
            }
            let next = users.length === filteredData.per ? (filteredData.page + 1) : '';
            if (next > total) {
                next = '';
            }

            // Construct the previous and next page URIs
            const uriPrefix = `/api/admin/users`
            const prevPage = `${uriPrefix}?per=${filteredData.per}&page=${prev}`;
            const nextPage = `${uriPrefix}?per=${filteredData.per}&page=${next}`;

            return res.status(200).json({
                success: true,
                data: {
                    count,
                    total,
                    per: filteredData.per,
                    page: filteredData.page,
                    prev: prevPage,
                    next: nextPage,
                    data: users,
                },
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message || err.toString(),
            });
        }
    }),
    logout: asyncHandler(async (req, res) => {
        req.session.destroy();
        res.clearCookie('admin_token');

        return res.status(200).json({
            success: true,
            message: 'Admin logged out successfully.',
        });
    }),
}
