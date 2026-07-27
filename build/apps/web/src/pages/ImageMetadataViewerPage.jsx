import React from 'react';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const ImageMetadataViewerPage = () => {
  const getFallbackData = () => ({
    toolName: 'Image Metadata Viewer',
    toolDescription: 'View EXIF, IPTC, and XMP metadata from your images.',
    whatToolDoes: 'Extracts and displays hidden metadata from image files.',
    whyUseful: ['Check camera settings', 'Find GPS coordinates', 'Verify copyright info'],
    howToUseSteps: ['Upload an image', 'View the extracted metadata', 'Copy or download the data'],
    howItWorks: 'Uses client-side parsing to read EXIF headers without uploading your image to a server.',
    features: ['EXIF support', 'GPS extraction', 'Fast processing'],
    useCases: ['Photographers', 'Investigators', 'Privacy conscious users'],
    faqs: [{ question: 'Is my image uploaded?', answer: 'No, processing happens locally.' }],
    seoContent: 'View image metadata online for free with our secure EXIF viewer.',
    relatedTools: []
  });

  return (
    <ToolPageTemplate toolData={toolPageData['image-metadata-viewer'] || getFallbackData()}>
      <div className="p-12 border-2 border-dashed rounded-xl text-center bg-muted/30">
        <p className="text-muted-foreground">Metadata Viewer functionality coming soon.</p>
      </div>
    </ToolPageTemplate>
  );
};

export default ImageMetadataViewerPage;