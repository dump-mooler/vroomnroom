const { Advert, Category, User } = require("../models");
const redisClient = require('../config/redisClient');

const sequelize = require("sequelize");
const { Op } = require("sequelize");

exports.createAdvert = async (req, res) => {
  try {
    const newAdvert = await Advert.create({...req.body, posterId: req.user.id});

    const keys = await redisClient.keys('/advert*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }

    res.status(201).json(newAdvert);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create advert" });
  }
};

exports.getAdvert = async (req, res) => {
  try {
    const _advert = await Advert.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
        {
          model: User,
          attributes: ["id", "fullName", "username", "phoneNumbers", "role"],
        },
      ],
    });
    if (!_advert) {
      return res.status(404).json({ error: "Advert not found" });
    }
    res.status(200).json({
      advert: _advert,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getLocations = async (req, res) => {
  try {
    const locations = await Advert.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('city')), 'city']],
      where: {
        city: {
          [Op.not]: null
        }
      },
      raw: true
    });

    const cities = locations.map(location => location.city).filter(Boolean);
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch locations" });
  }
};

exports.dashboard = async (req, res) => {
  try {
    const totalStats = await Advert.findOne({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalAdverts'],
        [sequelize.fn('SUM', sequelize.col('price')), 'totalValue'],
        [sequelize.fn('COUNT', sequelize.literal('CASE WHEN "isSold" = true THEN 1 END')), 'totalSold']
      ]
    });

    const categoryStats = await Advert.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('Advert.id')), 'total'],
        [sequelize.fn('COUNT', sequelize.literal('CASE WHEN Advert.isSold = true THEN 1 END')), 'sold'],
        [sequelize.fn('SUM', sequelize.col('Advert.price')), 'totalValue']
      ],
      include: [{
        model: Category,
        attributes: ['name']
      }],
      group: ['Advert.category', 'Category.id', 'Category.name']
    });

    const recentAdverts = await Advert.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        attributes: ['username', 'fullName']
      }]
    });

    const cityStats = await Advert.findAll({
      attributes: [
        'city',
        [sequelize.fn('COUNT', sequelize.col('id')), 'total']
      ],
      where: {
        city: {
          [Op.not]: null
        }
      },
      group: ['city']
    });

    const monthlyStats = await Advert.findAll({
      attributes: [
        [sequelize.fn('strftime', '%Y-%m', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('price')), 'value']
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 6))
        }
      },
      group: [sequelize.fn('strftime', '%Y-%m', sequelize.col('createdAt'))],
      order: [[sequelize.fn('strftime', '%Y-%m', sequelize.col('createdAt')), 'ASC']]
    });
    

    res.status(200).json({
      overview: {
        totalAdverts: parseInt(totalStats.getDataValue('totalAdverts')),
        totalValue: parseFloat(totalStats.getDataValue('totalValue')),
        totalSold: parseInt(totalStats.getDataValue('totalSold'))
      },
      categoryBreakdown: categoryStats.map(stat => ({
        category: stat.Category.name,
        total: parseInt(stat.getDataValue('total')),
        sold: parseInt(stat.getDataValue('sold')),
        totalValue: parseFloat(stat.getDataValue('totalValue'))
      })),
      recentAdverts: recentAdverts.map(advert => ({
        id: advert.id,
        title: advert.title,
        price: advert.price,
        createdAt: advert.createdAt,
        postedBy: advert.User.fullName
      })),
      cityDistribution: cityStats.map(stat => ({
        city: stat.city,
        total: parseInt(stat.getDataValue('total'))
      })),
      monthlyTrends: monthlyStats.map(stat => ({
        month: stat.getDataValue('month'),
        count: parseInt(stat.getDataValue('count')),
        value: parseFloat(stat.getDataValue('value'))
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

exports.getAdverts = async (req, res) => {
  const filters = req.headers.filters ? JSON.parse(req.headers.filters) : {};
  console.log({filters: req.headers.filters})
  const page = parseInt(filters.page, 10) || 1;
  const limit = parseInt(filters.limit, 10) || 10;
  const search = filters.search || "";
  const category = filters.category || "";
  const level = filters.level || "";
  const city = filters.city || "";
  const minPrice = parseFloat(filters.minPrice);
  const maxPrice = parseFloat(filters.maxPrice);

  const offset = (page - 1) * limit;
  try {
    const options = {
      where: {},
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    };

    if (search) {
      const searchPattern = `%${search}%`;
      options.where = {
        [Op.and]: [
          {
            [Op.or]: [
              { title: { [Op.like]: searchPattern } },
              { description: { [Op.like]: searchPattern } },
            ],
          },
        ],
      };
    }

    if (category) {
      options.where.category = category;
    }

    if (city) {
      options.where.city = city;
    }

    if (level) {
      options.where.level = level;
    }

    if (minPrice || maxPrice) {
      options.where.price = {};
      if (minPrice) {
        options.where.price[Op.gte] = minPrice;
      }
      if (maxPrice) {
        options.where.price[Op.lte] = maxPrice;
      }
    }

    const { rows: adverts, count } = await Advert.findAndCountAll({
      ...options,
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
        {
          model: User,
          attributes: ["id", "username", "phoneNumbers", "role", "fullName"],
        },
      ],
    });

    return res.status(200).json({
      adverts,
      count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};

exports.closeAdvert = async (req, res) => {
  try {
    const _advert = await Advert.findByPk(req.params.id);
    if (!_advert) {
      return res.status(404).json({ error: "Advert not found" });
    }
    await Advert.update(
      { isSold: _advert.isSold ? false : true },
      { where: { id: req.params.id } }
    );

    const keys = await redisClient.keys('/advert*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    
    const updatedAdvert = await Advert.findByPk(req.params.id);
    res.status(200).json({ advert: updatedAdvert });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.updateAdvert = async (req, res) => {
  try {
    const _advert = await Advert.findByPk(req.params.id);
    if (!_advert) {
      return res.status(404).json({ error: "Advert not found" });
    }

    const {
      media,
      attrs,
      description,
      category,
      price,
      city,
      title,
      level,
      thumbnail,
    } = req.body;

    const advert = await Advert.update(
      {
        media,
        attrs,
        description,
        category,
        price,
        city,
        title,
        level,
        thumbnail,
      },
      { where: { id: req.params.id } }
    );

    const keys = await redisClient.keys('/advert*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    
    res.status(201).json({ advert });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.deleteAdvert = async (req, res) => {
  try {
    const advert = await Advert.findByPk(req.params.id);
    if (!advert) {
      return res.status(404).json({ error: "Advert not found" });
    }
    await advert.destroy();
    res.status(204).json();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
