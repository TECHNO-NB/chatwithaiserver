import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

(async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure:true,
    });
    console.log("successfully connected to cloudinary");
  } catch (error) {
    console.log(error);
  }
})();

const uploadToCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) {
      console.log("No file path provided");
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log("Cloudinary Error", error);
    fs.unlinkSync(localFilePath);
  }
};

const deleteCloudinaryFile = async (url: string): Promise<any> => {
  try {
    if (!url) {
      console.log("url is required");
      return;
    }

    const publicId = url.split("/").pop()?.split(".")[0];
    if (!publicId) {
      console.log("Could not extract public ID from the URL");
      return;
    }

    const deleteFile = await cloudinary.uploader.destroy(publicId);
    return deleteFile;
  } catch (error) {
    console.log("Cloudinary delete Error", error);
  }
};

export { uploadToCloudinary, deleteCloudinaryFile };
