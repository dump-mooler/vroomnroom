const express = require("express");
const {
  register,
  login,
  me,
  updatePassword,
  getUsers,
  getUser,
  deleteUser,
  updateUser
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

const validate = require("../middleware/validate");
const { create, update, updateUserValidation } = require("../validations/userValidation");

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
router.put("/update-user/:id", authMiddleware, validate(updateUserValidation), updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router.post("/login", login);

module.exports = router;
