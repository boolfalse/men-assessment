
const express = require('express');
const router = express.Router();
const linksController = require('../controllers/links');
const { userMiddleware } = require('../middlewares/auth');



router.get('/', userMiddleware, linksController.all);
router.post('/', userMiddleware, linksController.create);
router.get('/:referral_key', userMiddleware, linksController.referral);

module.exports = router;
