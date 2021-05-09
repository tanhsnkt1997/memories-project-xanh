import multer from "multer";

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

let imageMessageUploadFile = multer({
  storage: storage,
  limits: { fileSize: 5242880 },
  fileFilter: function (req, file, callback) {
    let typeFiles = ["image/png", "image/jpg", "image/jpeg"];
    if (typeFiles.indexOf(file.mimetype) === -1) {
      // check kieu co thuoc jpg, png,jpeg
      return callback("File type invalid !!", null); //error,success
    }
    callback(null, true);
  },
}); // formData.append("image", fileData);

export default imageMessageUploadFile;
