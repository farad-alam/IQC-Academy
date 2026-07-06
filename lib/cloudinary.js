import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary only if environment variables are present
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Uploads a base64 or buffer image to Cloudinary
 * @param {string} file - The file data (base64 or URI)
 * @param {string} folder - The destination folder in Cloudinary
 * @returns {Promise<string>} The secure URL of the uploaded image
 */
export async function uploadImage(file, folder = 'iqc-academy') {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn('Cloudinary not configured. Skipping upload.');
    return null;
  }
  
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'auto'
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
}
