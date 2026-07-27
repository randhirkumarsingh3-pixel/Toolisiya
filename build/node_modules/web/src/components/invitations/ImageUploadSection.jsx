import React from 'react';
import { Card } from '@/components/ui/card';
import ImageUploadComponent from './ImageUploadComponent.jsx';

const ImageUploadSection = ({ images, onImagesChange }) => {
  const handleImageUpload = (key, imageData) => {
    onImagesChange({ ...images, [key]: imageData });
  };

  const handleImageRemove = (key) => {
    onImagesChange({ ...images, [key]: null });
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Upload Photos</h3>
        <p className="text-sm text-muted-foreground">Add photos to personalize your invitation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploadComponent
          label="Groom's Photo"
          currentImage={images.groom}
          onImageUpload={(img) => handleImageUpload('groom', img)}
          onRemove={() => handleImageRemove('groom')}
          maxSizeMB={5}
        />

        <ImageUploadComponent
          label="Bride's Photo"
          currentImage={images.bride}
          onImageUpload={(img) => handleImageUpload('bride', img)}
          onRemove={() => handleImageRemove('bride')}
          maxSizeMB={5}
        />

        <ImageUploadComponent
          label="Family Photo (Optional)"
          currentImage={images.family}
          onImageUpload={(img) => handleImageUpload('family', img)}
          onRemove={() => handleImageRemove('family')}
          maxSizeMB={5}
        />

        <ImageUploadComponent
          label="Background Image (Optional)"
          currentImage={images.background}
          onImageUpload={(img) => handleImageUpload('background', img)}
          onRemove={() => handleImageRemove('background')}
          maxSizeMB={10}
        />
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Photo Guidelines</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Use high-quality images (JPG or PNG format)</li>
          <li>• Portrait photos work best for groom and bride</li>
          <li>• Maximum file size: 5MB for photos, 10MB for background</li>
          <li>• Images will be automatically optimized for best quality</li>
        </ul>
      </div>
    </Card>
  );
};

export default ImageUploadSection;