// const Advert = require("../models/advert");
// const Category = require("../models/advert");
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

exports.getAdverts = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const search = req.query.search || "";
  const category = req.query.category || "";

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
