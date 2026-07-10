import fs from 'fs';
import path from 'path';

const contentPath = path.resolve('src/data/toolSeoContent.js');
let content = fs.readFileSync(contentPath, 'utf8');

const highQualityTools = [
  'edit-pdf', 'compress-pdf', 'gst-calculator', 'ocr-document-reader', 
  'document-scanner', 'resume-builder', 'salary-calculator', 'qr-generator', 
  'image-compressor', 'photo-editor', 'invoice-generator', 'json-formatter', 
  'markdown-to-html', 'speech-to-text', 'budget-planner', 'investment-calculator', 
  'tax-calculator', 'fd-calculator', 'loan-calculator', 'pdf-to-word', 
  'word-to-pdf', 'certificate-generator', 'cover-letter-generator', 
  'proposal-generator', 'letter-generator', 'image-converter'
];

// We need to inject the properties right after the opening brace of each tool object.
// The regex looks for the tool key:   'tool-name': {
const regex = /^(\s*)'([a-zA-Z0-9-]+)':\s*\{/gm;

let updatedContent = content.replace(regex, (match, indent, toolName) => {
  const isHigh = highQualityTools.includes(toolName);
  const quality = isHigh ? 'high' : 'low';
  const indexable = isHigh ? 'true' : 'false';
  const score = isHigh ? 95 : 30;
  
  const inject = `\n${indent}  seoQuality: "${quality}",\n${indent}  indexable: ${indexable},\n${indent}  contentScore: ${score},\n${indent}  lastReviewed: "2026-07-10",`;
  
  return match + inject;
});

fs.writeFileSync(contentPath, updatedContent, 'utf8');
console.log('Successfully injected SEO Quality metrics into toolSeoContent.js');
