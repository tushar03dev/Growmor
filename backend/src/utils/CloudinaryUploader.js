// utils/cloudinaryUploader.js
const cloudinary = require('../config/cloudinary');

const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'your_folder_name', // Optional: specify a folder in your Cloudinary account
    });
    return result.secure_url; // Returns the URL of the uploaded image
  } catch (error) {
    throw new Error('Image upload failed');
  }
};

module.exports = uploadImage;
