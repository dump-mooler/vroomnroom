// routes/authRoutes.js
const express = require('express');
const { register, login, updatePassword } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authMiddleware, register);
router.put('/update-password/:id', authMiddleware, updatePassword);
router.post('/login', login);

module.exports = router;
