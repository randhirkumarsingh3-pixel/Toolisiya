import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ImageUploadComponent = ({ 
  label, 
  onImageUpload, 
  currentImage, 
  onRemove,
  aspectRatio = 1,
  maxSizeMB = 5
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG, or WebP)');
      return;
    }

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`Image size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Read file and create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageUpload(e.target.result);
      toast.success('Image uploaded successfully');
    };
    reader.readAsDataURL(file);
  }, [onImageUpload, maxSizeMB]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0];
    handleFile(file);
  }, [handleFile]);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      
      {currentImage ? (
        <div className="relative group">
          <img 
            src={currentImage} 
            alt={label}
            className="w-full h-48 object-cover rounded-lg border-2 border-border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary hover:bg-muted/50'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id={`image-upload-${label}`}
          />
          <label htmlFor={`image-upload-${label}`} className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-primary/10 rounded-full">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Drop image here or click to upload
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or WebP (max {maxSizeMB}MB)
                </p>
              </div>
            </div>
          </label>
        </div>
      )}
    </div>
  );
};

export default ImageUploadComponent;