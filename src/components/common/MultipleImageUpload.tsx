import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadToCloudinary } from '../../api/config/cloudinary';
import { toast } from 'react-hot-toast';

interface ImageItem {
  url: string;
  caption?: string;
  isPrimary: boolean;
}

interface MultipleImageUploadProps {
  onImagesChange: (images: ImageItem[]) => void;
  currentImages?: ImageItem[];
  className?: string;
  disabled?: boolean;
  maxImages?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  onImagesChange,
  currentImages = [],
  className = '',
  disabled = false,
  maxImages = 10,
  maxSize = 5, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload an image.');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB.`);
      return;
    }

    // Check if we've reached the maximum number of images
    if (currentImages.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed.`);
      return;
    }

    setIsUploading(true);
    
    try {
      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file);
      
      // Add new image to the list
      const newImage: ImageItem = {
        url: imageUrl,
        caption: '',
        isPrimary: currentImages.length === 0 // First image is primary by default
      };
      
      const updatedImages = [...currentImages, newImage];
      onImagesChange(updatedImages);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = (index: number) => {
    const updatedImages = currentImages.filter((_, i) => i !== index);
    
    // If we removed the primary image and there are other images, make the first one primary
    if (currentImages[index].isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }
    
    onImagesChange(updatedImages);
  };

  const handleSetPrimary = (index: number) => {
    const updatedImages = currentImages.map((image, i) => ({
      ...image,
      isPrimary: i === index
    }));
    onImagesChange(updatedImages);
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const updatedImages = currentImages.map((image, i) => 
      i === index ? { ...image, caption } : image
    );
    onImagesChange(updatedImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Upload Area */}
      {currentImages.length < maxImages && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 mb-4 ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          } ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          {isUploading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <>
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="text-sm text-gray-600">
                <p className="font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs mt-1">
                  PNG, JPG, GIF, WEBP up to {maxSize}MB
                </p>
                <p className="text-xs mt-1">
                  {currentImages.length} of {maxImages} images uploaded
                </p>
              </div>
              <Upload className="mx-auto h-6 w-6 text-gray-400 mt-2" />
            </>
          )}
        </div>
      )}

      {/* Image Gallery */}
      {currentImages.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Event Images ({currentImages.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentImages.map((image, index) => (
              <div key={index} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={`Event image ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                
                {/* Primary Badge */}
                {image.isPrimary && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                      Primary
                    </span>
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(index)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-all duration-200"
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </button>

                {/* Set Primary Button */}
                {!image.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(index)}
                    className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-all duration-200"
                    disabled={disabled}
                  >
                    Set Primary
                  </button>
                )}

                {/* Caption Input */}
                <div className="p-3 bg-white">
                  <input
                    type="text"
                    placeholder="Add caption (optional)"
                    value={image.caption || ''}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={disabled}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleImageUpload; 