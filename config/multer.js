const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    // params: {
    //     folder: "carshow", // Cloudinary folder name
    //     allowed_formats: ["jpg", "jpeg", "png"], // Allowed file types
    //     type: "upload",
    // },
});

const upload = multer({ storage: storage });

module.exports = upload; 