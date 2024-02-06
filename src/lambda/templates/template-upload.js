import AWS from "aws-sdk";
import parser from 'partparse';
const s3 = new AWS.S3({
    s3ForcePathStyle: true,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    endpoint: new AWS.Endpoint(process.env.S3_ENDPOINT),
});


export async function handler (event) {

    const data = await parser.parse(event);
    let files = [];

    for (let i = 0; i < data.files.length; i++) {
        if (data.files[i].filename) {
            try {
                await s3.putObject({Bucket: process.env.S3_BUCKET, Key: data.files[i].filename, ACL: 'public-read', Body: data.files[i].content}).promise();
                files.push({link: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${data.files[i].filename}`});
            } catch (err) {
                return {
                    statusCode: 500,
                    body: JSON.stringify({message: err.stack})
                }
            }
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify(files)
    }

}
