const express = require("express");
const {
  createAdvert,
  getAdverts,
  deleteAdvert,
  closeAdvert,
  updateAdvert,
  getAdvert,
  getLocations
} = require("../controllers/advertController");
const { authMiddleware } = require("../middleware/authMiddleware");
const cacheMiddleware = require("../middleware/cache");

const validate = require("../middleware/validate");
const { create, update } = require("../validations/advertValidation");

const router = express.Router();

router.get("/", cacheMiddleware(300), getAdverts);
router.get('/locations', cacheMiddleware(300), getLocations)
router.get("/:id", cacheMiddleware(300), getAdvert);
router.post("/", authMiddleware, validate(create), createAdvert);
router.put("/:id", authMiddleware, validate(update), updateAdvert);
router.put("/close-advert/:id", authMiddleware, closeAdvert);
router.delete("/:id", authMiddleware, deleteAdvert);

module.exports = router;
