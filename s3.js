import { config } from "dotenv";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

export async function upload(file, name) {
  try {
    const stream = fs.createReadStream(file.tempFilePath);
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: name,
      Body: stream,
    };
    return await s3Client.send(new PutObjectCommand(params));
  } catch (error) {
    console.log("error:" + error);
    return error;
  }
}

export async function getFiles() {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
    };
    return await s3Client.send(new ListObjectsCommand(params));
  } catch (error) {
    console.log("error:" + error);
    return error;
  }
}

export async function getFile(id) {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: id,
    };
    return await s3Client.send(new GetObjectCommand(params));
  } catch (error) {
    console.log("error:" + error);
    return error;
  }
}

export async function downloadFile(id) {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: id,
    };
    return (await s3Client.send(new GetObjectCommand(params))).Body.pipe(
      fs.createWriteStream("./images/" + id)
    );
  } catch (error) {
    console.log("error:" + error);
    return error;
  }
}

export async function getFileUrl(id) {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: id,
    };
    return await getSignedUrl(s3Client, new GetObjectCommand(params), {
      expiresIn: 3600,
    });
  } catch (error) {
    console.log("error:" + error);
    return error;
  }
}
