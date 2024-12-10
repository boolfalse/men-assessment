
const express = require('express');
const router = express.Router();
const linksController = require('../controllers/links');
const authMiddleware = require('../middlewares/auth');



router.get('/', authMiddleware, linksController.all);
router.post('/', authMiddleware, linksController.create);
router.get('/:referral_key', authMiddleware, linksController.referral);

module.exports = router;
