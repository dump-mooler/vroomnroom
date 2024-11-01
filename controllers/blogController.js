
const Blog = require('../models/blog');
const sequelize = require('sequelize');
const { Op } = require('sequelize');

exports.createBlog = async (req, res) => {
  try {
    const { title, thumbnail, body, location } = req.body;
    const newBlog = await Blog.create({ title, thumbnail, body, location });
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
};

exports.getBlogs = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const search = req.query.search || '';
  const location = req.query.location || '';

  const offset = (page - 1) * limit;

  try {
    const options = {
      where: {},
      limit,
      offset,
    };

  
    if (search) {
      const searchPattern = `%${search}%`;
      options.where = {
        [Op.and]: [
          {
            [Op.or]: [
              { title: { [Op.like]: searchPattern } },
              { body: { [Op.like]: searchPattern } },
            ],
          },
        ],
      };
    }

  
    if (location) {
      options.where.location = location;
    }

    const { rows: blogs, count } = await Blog.findAndCountAll(options);

    res.status(200).json({
      data: blogs,
      count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'An error occurred while fetching blogs' });
  }
};

exports.getLocations = async (req, res) => {
  try {
    const locations = await Blog.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('location')), 'location'],
      ],
      raw: true,
    });

    const locationList = locations.map((loc) => loc.location);
    res.status(200).json({ locations: locationList });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve locations' });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve blog' });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { title, thumbnail, body, location } = req.body;
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    blog.title = title || blog.title;
    blog.thumbnail = thumbnail || blog.thumbnail;
    blog.body = body || blog.body;
    blog.location = location || blog.location;
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    await blog.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};
