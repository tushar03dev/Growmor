import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export async function getObjectURL(key: string) {
    try {
        console.log(`Generating signed URL for key: ${key}, bucket: ${process.env.AWS_BUCKET_NAME}`);
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 43200 });
        console.log(`Signed URL generated: ${url}`);
        return url;
    } catch (error: any) {
        console.error("Error generating signed URL:", {
            message: error.message,
            stack: error.stack,
            key,
            bucket: process.env.AWS_BUCKET_NAME,
        });
        throw error;
    }
}



