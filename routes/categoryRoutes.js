const express = require('express');
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { authMiddleware } = require('../middleware/authMiddleware');
const validate = require("../middleware/validate")
const { create, update } = require("../validations/categoryValidation")

const router = express.Router();

router.get('/', getCategories);
router.post('/', authMiddleware, validate(create), createCategory);
router.put('/:id', authMiddleware, validate(update), updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

module.exports = router;
