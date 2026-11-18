import api from './api';

export const uploadMultipleToCloudinary = async (files) => {
  const formData = new FormData();

  files
    .filter(file => file !== null)
    .forEach(file => formData.append('images', file));

  try {
    const response = await api.post('/api/product/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (!response.data.success) {
      return {
        success: false,
        urls: [],
        error: response.data.message || 'Upload failed'
      };
    }

    return {
      success: true,
      urls: response.data.urls
    };
  } catch (error) {
    return {
      success: false,
      urls: [],
      error: error.response?.data?.message || error.message || 'Upload failed'
    };
  }
};
