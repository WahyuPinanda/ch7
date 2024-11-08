const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerMiddleware"); 
const imageController = require("../controllers/imageController");

router.post("/add-image", upload, imageController.addImage);
router.get("/get-allimage", imageController.getAllImages);
router.get("/getData/:id", imageController.getImageById);
router.put("/edit-data/:id", imageController.updateImage);
router.delete("/delete-data/:id", imageController.deleteImage);
module.exports = router;