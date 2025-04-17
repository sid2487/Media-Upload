import { v2 } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log(`cloud name: ${cloud_name}`);
console.log(`api key: ${api_key}`);
console.log(`api secret: ${api_secret}`);

export { cloudinary };