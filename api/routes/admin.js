
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const { adminMiddleware } = require('../middlewares/auth');
const authValidation = require('../middlewares/auth-validation');



router.post('/login', authValidation.login, adminController.login);
router.post('/logout', adminController.logout);
router.get('/users', adminMiddleware, adminController.getUsers);

module.exports = router;
