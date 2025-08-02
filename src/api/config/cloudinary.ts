export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || 'your-api-key',
};

// For images
export const CLOUDINARY_IMAGE_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;

// For documents (PDF, DOCX, etc.)
export const CLOUDINARY_DOCUMENT_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/raw/upload`;

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('cloud_name', cloudinaryConfig.cloudName);

  // Determine if it's an image or document based on file type
  const isImage = file.type.startsWith('image/');
  const uploadUrl = isImage ? CLOUDINARY_IMAGE_UPLOAD_URL : CLOUDINARY_DOCUMENT_UPLOAD_URL;

  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file');
  }
};

// Specific function for document uploads
export const uploadDocumentToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('cloud_name', cloudinaryConfig.cloudName);
  
  // Add resource type for documents
  formData.append('resource_type', 'raw');

  try {
    const response = await fetch(CLOUDINARY_DOCUMENT_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Document upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary document upload error:', error);
    throw new Error('Failed to upload document');
  }
}; 