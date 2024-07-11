import { v2 as cloudinary } from "cloudinary";
import 'dotenv/config'
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_USER_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath)=>{
    try {
        if(!filePath) return null
        // upload on file cloudinary
        const response = await cloudinary.uploader.upload(filePath,{
            resource_type:'auto'
        })
        // file upload Checking 
        // console.log(`file uploaded on cloudinary ${response.url} Here`);
        fs.unlinkSync(filePath)
        return response
    } catch (error) {
        fs.unlinkSync(filePath)
        console.log(`file not uploaded :( ${error}`);
        return null
    }
}

export { uploadOnCloudinary }
