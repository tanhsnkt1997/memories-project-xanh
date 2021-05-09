import { google } from "googleapis";
import path from "path";
import fs from "fs";
import { throws } from "assert";

const CLIENT_ID = "674287327063-8erb1jtci7984iopuv7f6gdlre9ougpd.apps.googleusercontent.com";
const CLIENT_SECRET = "ljZlqBSKn5LWJs4mr0Cpuk4B";
const REDIRECT_URL = "https://developers.google.com/oauthplayground/";
const REFRESH_TOKEN = "1//04jtk6yjJbHTnCgYIARAAGAQSNwF-L9IrUfRCf4ZEVwAmbUghhlscqJqTFemQMpSfNhYL1a4XSJyNFiiVM8-5bHDU0YfHZ5zqRfc";

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth: oauth2Client });

// const filePath = path.join("./", "memori.png");
async function uploadFile(file) {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: file.filename,
        mimeType: file.mimetype,
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(path.join("./images/", file.filename)),
      },
    });
    return Promise.resolve(response.data);
  } catch (error) {
    console.log("error when upload file message", error);
    throw error;
  }
}

// uploadFile();

async function deleteFile(fileId) {
  try {
    const response = await drive.files.delete({ fileId });
    return true;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

// deleteFile();

async function generatePublic(gooleFileId) {
  return new Promise(async function (resolve, reject) {
    try {
      await drive.permissions.create({
        fileId: gooleFileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
      const result = await drive.files.get({
        fileId: gooleFileId, //google id sau khi day len tra ve
        fields: "webViewLink, webContentLink",
      });
      resolve(result.data);
      // console.log(result.data);
    } catch (error) {
      reject(error.message);
      console.log("error generatePublic", error.message);
    }
  });
}

// generatePublic();

export default { uploadFile, generatePublic, deleteFile };
