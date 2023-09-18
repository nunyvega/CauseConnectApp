// multerConfig.js: Configuration for managing user image uploads using multer

const multer = require("multer");
const path = require("path");

// Define storage settings for multer
const storage = multer.diskStorage({
  // Set the destination for storing uploaded files
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/uploads/"));
  },
  // Set the filename for the uploaded files
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
});

// Initialize multer with the defined storage settings
const upload = multer({ storage });

module.exports = upload;
