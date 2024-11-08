const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];

    if (allowedTypes.includes(file.mimetype)) {
      console.log("File type allowed:", file.mimetype);
      cb(null, true);
    } else {
      console.log("File type not allowed:", file.mimetype);
      const err = new Error("Tidak boleh selain PNG dan JPG!");
      cb(err, false);
    }
  },
  onError: (err, next) => {
    console.log("Error in Multer:", err.message);
    next(err);
  }
}).single("image");

module.exports = upload;
