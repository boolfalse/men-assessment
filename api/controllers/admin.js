
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const validate = require('../validations/admin');



module.exports = {
    getUsers: asyncHandler(async (req, res) => {
        // validate and sanitize the query parameters
        const filteredParams = validate.getUsers(req.query);

        try {
            const users = await User.find()
                .select('id name email isAdmin')
                .skip((filteredParams.page - 1) * filteredParams.per)
                .limit(filteredParams.per);
            const count = await User.countDocuments();

            // Pagination
            let total = Math.ceil(count / filteredParams.per);
            let prev = filteredParams.page - 1;
            if (prev <= 0 || (filteredParams.page * filteredParams.per <= count && filteredParams.page === 1)) {
                prev = '';
            }
            let next = users.length === filteredParams.per ? (filteredParams.page + 1) : '';
            if (next > total) {
                next = '';
            }

            // Construct the previous and next page URLs
            const uriPrefix = `${process.env.BASE_URL}:${process.env.PORT}/api/admin/users`
            const prevPage = `${uriPrefix}?per=${filteredParams.per}&page=${prev}`;
            const nextPage = `${uriPrefix}?per=${filteredParams.per}&page=${next}`;

            return res.status(200).json({
                success: true,
                data: {
                    count,
                    total,
                    per: filteredParams.per,
                    page: filteredParams.page,
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
}
