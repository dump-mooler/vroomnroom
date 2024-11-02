const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { Op } = require("sequelize");

exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: [role],
    });
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    if (error.errors.length)
      return res.status(400).json({ error: error.errors[0]?.message });

    res.status(400).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      where: { username },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      "234qwer45t7uoklfghj7uiasd23dwed32.,.,sdfsdaf",
      { expiresIn: "24h" }
    );

    const _user = await User.findOne({
      where: { username },
      attributes: { exclude: ["password"] },
    });

    res
      .status(200)
      .json({ message: "Logged in successfully", token, user: _user });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.me = async (req, res) => {
  console.log(res.user);
  try {
    if (req.user.id) {
      const user = await User.findOne({
        where: { id: req.user.id },
        attributes: { exclude: ["password"] },
      });
      return res.status(200).json({
        user,
      });
    } else {
      return res.status(400).json({
        user: null,
      });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    const options = {
      where: {},
      limit,
      offset,
      attributes: { exclude: ["password"] },
    };

    if (search) {
      const searchPattern = `%${search}%`;
      options.where = {
        [Op.and]: [
          {
            [Op.or]: [{ username: { [Op.like]: searchPattern } }],
          },
        ],
      };
    }

    const { rows: users, count } = await User.findAndCountAll(options);
    return res.status(200).json({
      users,
      count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    delete user.password;
    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.updatePassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ error: "New password is required" });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.destroy();
    res.status(204).json();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
