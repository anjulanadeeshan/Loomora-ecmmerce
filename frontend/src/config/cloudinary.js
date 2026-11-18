// Cloudinary Configuration
// Get your credentials from: https://cloudinary.com/console

export const CLOUDINARY_CONFIG = {
  cloudName: 'diujju82k', // Replace with your Cloudinary cloud name
  uploadPreset: 'ecommerce_preset',
  folder: 'loomora/products'
};

// Upload image to Cloudinary
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('folder', CLOUDINARY_CONFIG.folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Upload multiple images
export const uploadMultipleToCloudinary = async (files) => {
  const uploadPromises = files
    .filter(file => file !== null)
    .map(file => uploadToCloudinary(file));

  try {
    const results = await Promise.all(uploadPromises);
    const failedUpload = results.find(result => !result.success);
    if (failedUpload) {
      return {
        success: false,
        urls: [],
        error: failedUpload.error || 'One or more image uploads failed'
      };
    }

    const urls = results.map(result => result.url);

    return {
      success: true,
      urls
    };
  } catch (error) {
    console.error('Multiple upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
