import googleApi from "../server/googleDrive.js";
import sharp from "sharp";

let imgResizeAndUpload = (listFile) => {
  return new Promise(async (resolve, rejects) => {
    let arrImageUploadedPromise = listFile.map(async (file) => {
      //Sharp
      let resizeResult = await sharp("./images/" + file.filename)
        .resize(null, 300, {
          kernel: sharp.kernel.kernel,
          // fit: sharp.fit.inside,
          // withoutEnlargement: true,
          fastShrinkOnLoad: true,
        })
        .jpeg({
          quality: 100,
          chromaSubsampling: "4:4:4",
          kernel: sharp.kernel.kernel,
        })
        .toFile("./images/" + "224x224-" + file.filename);

      removeImg(file.filename);
      let googleFileData = await googleApi.uploadFile({ mimetype: file.mimetype, filename: "224x224-" + file.filename });

      //remove
      removeImg("224x224-" + file.filename);
      //check bug Cannot read property 'id' of undefined
      if (googleFileData?.id) {
        //cấp quyền truy cập công khai
        await googleApi.generatePublic(googleFileData.id);
        //return `https://drive.google.com/uc?export=view&id=${googleFileData.id}`;
        // googleApi.deleteFile(googleFileData.id);
        return `https://lh3.googleusercontent.com/d/${googleFileData.id}`;
      }
      return rejects("Bug get gooogle Drive Id");
    });

    let arrImageUploaded = await Promise.all(arrImageUploadedPromise);
    return resolve(arrImageUploaded);
  });
};

export default imgResizeAndUpload;
