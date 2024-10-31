const express = require('express');
const { createAdvert, getAdverts, deleteAdvert } = require('../controllers/advertController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAdverts);
router.post('/', authMiddleware, createAdvert);
router.delete('/:id', authMiddleware, deleteAdvert);

module.exports = router;
