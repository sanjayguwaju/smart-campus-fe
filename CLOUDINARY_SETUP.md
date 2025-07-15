no# Cloudinary Setup Guide

This guide will help you set up Cloudinary for image uploads in your Smart Campus application.

## 1. Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/) and sign up for a free account
2. Verify your email address
3. Log in to your Cloudinary dashboard

## 2. Get Your Cloudinary Credentials

1. In your Cloudinary dashboard, go to **Settings** → **Access Keys**
2. Copy your **Cloud Name**
3. Copy your **API Key**
4. Copy your **API Secret** (keep this secure)

## 3. Create an Upload Preset

1. In your Cloudinary dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Set the following:
   - **Preset name**: `smart-campus-uploads` (or any name you prefer)
   - **Signing Mode**: `Unsigned`
   - **Folder**: `smart-campus/events` (optional, for organization)
5. Click **Save**

## 4. Configure Environment Variables

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add the following variables:

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=smart-campus-uploads
VITE_CLOUDINARY_API_KEY=your-api-key

# Backend API URL
VITE_API_BASE_URL=http://localhost:3000/api
```

Replace the values with your actual Cloudinary credentials.

## 5. Backend Integration

To save the Cloudinary URLs to your backend, you'll need to:

1. **Update your Event model** to include an `imageUrl` field:

```javascript
// In your Event schema/model
{
  imageUrl: {
    type: String,
    required: false
  }
}
```

2. **Update your API endpoints** to handle the `imageUrl` field when creating/updating events.

3. **Example API endpoint**:

```javascript
// POST /api/events
app.post('/api/events', async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      imageUrl: req.body.imageUrl // This will be the Cloudinary URL
    };
    
    const event = await Event.create(eventData);
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});
```

## 6. Security Considerations

1. **Upload Preset**: Use unsigned uploads for client-side uploads
2. **File Types**: The component restricts uploads to image files only
3. **File Size**: Default limit is 5MB, configurable in the component
4. **CORS**: Ensure your Cloudinary account allows uploads from your domain

## 7. Usage

The `ImageUpload` component is now available throughout your application:

```jsx
import ImageUpload from '../components/common/ImageUpload';

// In your component
<ImageUpload
  onImageUpload={(url) => {
    // url is the Cloudinary URL
    setFormData(prev => ({ ...prev, imageUrl: url }));
  }}
  onImageRemove={() => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  }}
  currentImage={formData.imageUrl}
  maxSize={5} // 5MB
/>
```

## 8. Features

- **Drag & Drop**: Users can drag images directly onto the upload area
- **Click to Upload**: Traditional file picker functionality
- **Preview**: Shows image preview before upload
- **Progress Indicator**: Shows upload progress
- **File Validation**: Validates file type and size
- **Error Handling**: Toast notifications for errors
- **Responsive**: Works on all screen sizes

## 9. Troubleshooting

### Common Issues:

1. **Upload fails**: Check your upload preset is set to "Unsigned"
2. **CORS errors**: Ensure your Cloudinary account allows uploads from your domain
3. **File too large**: Increase the `maxSize` prop or compress the image
4. **Invalid file type**: Check the `acceptedTypes` prop

### Debug Steps:

1. Check browser console for errors
2. Verify environment variables are loaded correctly
3. Test with a small image file first
4. Check Cloudinary dashboard for upload logs

## 10. Advanced Configuration

You can customize the upload behavior by modifying the `uploadToCloudinary` function in `src/config/cloudinary.ts`:

- Add image transformations
- Set quality parameters
- Configure folder structure
- Add upload tags

Example with transformations:

```javascript
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('cloud_name', cloudinaryConfig.cloudName);
  
  // Add transformations
  formData.append('transformation', 'w_800,h_600,c_fill,q_auto');
  
  // ... rest of the function
};
```

That's it! Your Smart Campus application is now ready to handle image uploads with Cloudinary. 