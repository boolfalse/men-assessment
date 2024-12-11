
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const validate = require('../validations/admin');



module.exports = {
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

            // Construct the previous and next page URLs
            const uriPrefix = `${process.env.BASE_URL}:${process.env.PORT}/api/admin/users`
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
}
