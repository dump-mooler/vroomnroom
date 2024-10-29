// routes/blogRoutes.js
const express = require('express');
const { createBlog, getBlogs, getLocations, getBlogById, updateBlog, deleteBlog, } = require('../controllers/blogController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createBlog);
router.get('/', getBlogs);
router.get('/locations', getLocations); 
router.get('/:id', getBlogById);
router.put('/:id', authMiddleware, updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);

module.exports = router;
