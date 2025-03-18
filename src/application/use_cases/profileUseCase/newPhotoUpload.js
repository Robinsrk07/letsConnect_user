const AWS = require('aws-sdk');
require("dotenv").config(); // Load .env variables

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();


class NewPhotoUpload{
 
async execute(files){
console.log("file in new case",files);


    const fileUrls = await Promise.all(
        files.map(async (file) => {
            const fileName = `photo_${Date.now()}.${file.originalname.split('.').pop()}`;
            const params = {
                Bucket: "bucketletsconnect",
                Key: `uploads/${fileName}`,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            const data = await s3.upload(params).promise();
            return data.Location; // Return the S3 URL
        })
    )
    const photoUrl=fileUrls

    console.log("from newPhoto",photoUrl)

return photoUrl

}

  

}

module.exports = NewPhotoUpload