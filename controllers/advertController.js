const { Advert, Category } = require("../models");

const sequelize = require("sequelize");
const { Op } = require("sequelize");

exports.createAdvert = async (req, res) => {
  console.log(req.body);
  try {
    const newAdvert = await Advert.create(req.body);
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

exports.getAdverts = async (req, res) => {
  const page = parseInt(req.body.page, 10) || 1;
  const limit = parseInt(req.body.limit, 10) || 10;
  const search = req.body.search || "";
  const category = req.body.category || "";
  const level = req.body.level || "";
  const city = req.body.city || "";
  const minPrice = parseFloat(req.body.minPrice);
  const maxPrice = parseFloat(req.body.maxPrice);

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
      ],
    });

    return res.status(200).json({
      adverts,
      count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.closeAdvert = async (req, res) => {
  try {
    const _advert = await Advert.findByPk(req.params.id);
    if (!_advert) {
      return res.status(404).json({ error: "Advert not found" });
    }
    const advert = await Advert.update(
      { isSold: true },
      { where: { id: req.params.id } }
    );
    res.status(201).json({ advert });
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
