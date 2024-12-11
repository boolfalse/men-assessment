
const asyncHandler = require('express-async-handler');



const checkAdmin = asyncHandler(async (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({
            success: false,
            message: 'Forbidden!',
        });
    }

    next();
});

module.exports = checkAdmin;
