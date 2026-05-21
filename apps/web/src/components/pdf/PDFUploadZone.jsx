import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const PDFUploadZone = ({ onFileSelect, maxSize = 100 * 1024 * 1024 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const validateFile = (file) => {
    if (!file) {
      return 'No file selected';
    }
    
    if (file.type !== 'application/pdf') {
      return 'Please upload a PDF file';
    }
    
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
      return `File size exceeds ${maxSizeMB}MB limit`;
    }
    
    return null;
  };

  const handleFile = useCallback((selectedFile) => {
    const validationError = validateFile(selectedFile);
    
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }
    
    setError('');
    setFile(selectedFile);
    onFileSelect(selectedFile);
    toast.success('PDF uploaded successfully');
  }, [onFileSelect, maxSize]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  }, [handleFile]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card className="shadow-md border-border">
      <CardContent className="p-6">
        <div
          className={`pdf-upload-zone ${isDragging ? 'dragging' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('pdf-file-input').click()}
        >
          <input
            id="pdf-file-input"
            type="file"
            accept="application/pdf"
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-4">
            {file ? (
              <>
                <FileText className="h-16 w-16 text-primary" />
                <div className="text-center">
                  <p className="font-semibold text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Click or drag to replace
                </p>
              </>
            ) : (
              <>
                <Upload className="h-16 w-16 text-muted-foreground" />
                <div className="text-center">
                  <p className="font-semibold text-foreground mb-1">
                    Drop your PDF here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Maximum file size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        
        {error && (
          <div className="error-message mt-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PDFUploadZone;