const Category = require('../models/category');
const sequelize = require('sequelize');
const { Op } = require('sequelize');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

exports.getCategories = async (req, res) => {
    try {
        const { rows: categories, count } = await Category.findAndCountAll();
        return res.status(200).json({
            categories,
            count,
        })
    } catch (err) {
        res.status(500).json({ error: err })
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
          }
        const { name } = req.body;
        category.name = name || category.name;
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: err })
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found'})
        }
        await category.destroy();
        res.status(204).json();
    } catch (err) {
        res.status(500).json({ error: err })
    }
}