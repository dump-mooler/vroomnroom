const express = require('express');
const { createAdvert, getAdverts, deleteAdvert } = require('../controllers/advertController');
const { authMiddleware } = require('../middleware/authMiddleware');

const validate = require("../middleware/validate");
const { create } = require("../validations/advertValidation");

const router = express.Router();

router.get('/', getAdverts);
router.post('/', authMiddleware, validate(create), createAdvert);
router.delete('/:id', authMiddleware, deleteAdvert);

module.exports = router;
