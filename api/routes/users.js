
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const authMiddleware = require('../middlewares/auth');
const authValidation = require('../middlewares/auth-validation');



router.post('/register', authValidation.register, usersController.register);
router.post('/login', authValidation.login, usersController.login);
router.get('/profile', authMiddleware, usersController.profile);

module.exports = router;
