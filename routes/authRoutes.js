const express = require("express");
const {
  register,
  login,
  me,
  updatePassword,
  getUsers,
  getUser,
  deleteUser,
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

const validate = require("../middleware/validate");
const { create, update } = require("../validations/userValidation");

const router = express.Router();

router.get("/me", authMiddleware, me);
router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUser);
router.post("/register", authMiddleware, validate(create), register);
router.put(
  "/update-password/:id",
  authMiddleware,
  validate(update),
  updatePassword
);
router.delete("/:id", authMiddleware, deleteUser);
router.post("/login", login);

module.exports = router;
