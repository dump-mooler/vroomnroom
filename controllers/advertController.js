const Advert = require('../models/advert');
const sequelize = require('sequelize');
const { Op } = require('sequelize');

exports.createAdvert = async (req, res) => {
  try {
    const { attrs, category } = req.body;
    const newAdvert = await Advert.create({ attrs, category });
    res.status(201).json(newAdvert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create advert' });
  }
};

exports.getAdverts = async (req, res) => {
    try {
        const { rows: adverts, count } = await Advert.findAndCountAll();
        return res.status(200).json({
            adverts,
            count,
        })
    } catch (err) {
        res.status(500).json({ error: err })
    }
}

exports.deleteAdvert = async (req, res) => {
    try {
        const advert = await Advert.findByPk(req.params.id);
        if (!advert) {
            return res.status(404).json({ error: 'Advert not found'})
        }
        await advert.destroy();
        res.status(204).json();
    } catch (err) {
        res.status(500).json({ error: err })
    }
}