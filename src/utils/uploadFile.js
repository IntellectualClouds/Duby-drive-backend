const AWS = require("aws-sdk");
const fs = require("fs");
require("dotenv").config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const uploadFile = async (file) => {
  const fileStream = fs.createReadStream(file.path);


  // Check if file already exists in the bucket
  const fileExists = await s3.headObject({ Bucket: process.env.S3_BUCKET_NAME, Key: file.originalname }).promise()
    .then(() => true)
    .catch(() => false);

  // Add a timestamp or unique identifier to the filename if it already exists
  const fileName = fileExists ? `${Date.now()}-${file.originalname}` : file.originalname;


  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: fileStream,
  };

  const result = await s3.upload(params).promise();

  return result.Location;
};

module.exports = uploadFile;