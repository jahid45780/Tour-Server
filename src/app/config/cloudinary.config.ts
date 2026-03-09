import { v2 as cloudinary } from "cloudinary";
import { envVers } from "./env";

cloudinary.config({
    cloud_name:envVers.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key:envVers.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret:envVers.CLOUDINARY.CLOUDINARY_API_SECRET
})

export const cloudinaryUpload = cloudinary