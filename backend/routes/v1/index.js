const express = require('express');
const verifyToken = require('../../middlewares/verifyToken');

const user = require('./user');
const auth = require('./auth');

const router = express.Router();

router.use('/user', verifyToken, user);
router.use('/auth', auth)

module.exports = router;
