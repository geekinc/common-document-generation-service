import AWS from "aws-sdk";
import parser from 'partparse';
let s3;

if (process.env.S3_ENDPOINT === 'http://localhost:4569') {          // Local config
    s3 = new AWS.S3({
        s3ForcePathStyle: true,
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        endpoint: process.env.S3_ENDPOINT,
    });
} else {                                                            // AWS config
    s3 = new AWS.S3({
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    });
}

export async function handler (event) {

    // Grab the data from the multipart form
    let data = await parser.parse(event);
    data = data.files;

    let files = [];
    for (let i = 0; i < data.length; i++) {
        /* istanbul ignore next */  // Transpiled code means code coverage is not 100% without this
        if (data[i].filename) {
            try {
                await s3.putObject({
                    Bucket: process.env.S3_BUCKET,
                    Key: data[i].filename,
                    ACL: 'public-read',
                    Body: data[i].content
                }).promise();
            } catch (err) {
                return { statusCode: 500, body: JSON.stringify({message: err.stack}) }
            }
            files.push({link: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${data[i].filename}`});
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify(files)
    }

}
