
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const { userMiddleware } = require('../middlewares/auth');
const authValidation = require('../middlewares/auth-validation');



router.post('/register', authValidation.register, usersController.register);
router.post('/login', authValidation.login, usersController.login);
router.get('/profile', userMiddleware, usersController.profile);

module.exports = router;
