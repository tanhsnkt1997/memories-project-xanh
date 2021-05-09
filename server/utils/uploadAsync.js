import modelMulter from "../models/modelMulter.js";

const uploadAsyncOneFile = (req, res, file) => {
  const upload = modelMulter.single("image");
  return new Promise(function (resolve, reject) {
    upload(req, res, function (error) {
      if (error) {
        console.log("error in upload file", error);
        if (error.message) {
          return reject({ statusCode: 500, message: "Size img too large" });
        }
        return reject({ statusCode: 500, message: error });
      }
      return resolve();
    }).single("image");
  });
};

// uploadImage.array("image");

const uploadAsynAnyFile = (req, res, file) => {
  const upload = modelMulter.array("image");

  return new Promise(function (resolve, reject) {
    upload(req, res, function (error) {
      if (error) {
        console.log("error in upload file", error);
        if (error.message) {
          return reject({ statusCode: 500, message: "Size img too large" });
        }
        return reject({ statusCode: 500, message: error });
      }
      return resolve();
    });
  });
};

export default { uploadAsyncOneFile, uploadAsynAnyFile };
