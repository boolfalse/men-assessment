
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const authMiddleware = require('../middlewares/auth');
const checkAdminMiddleware = require('../middlewares/check-admin');



router.get('/users', authMiddleware, checkAdminMiddleware, adminController.getUsers);

module.exports = router;
