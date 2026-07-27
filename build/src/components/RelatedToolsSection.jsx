import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, Code, FileText, Briefcase, RefreshCw, Atom, FileDigit, Image } from 'lucide-react';
import { useActiveTools } from '@/contexts/ActiveToolsContext.jsx';

const CATEGORY_MAP = {
  Finance: [
    { name: 'GST Calculator', path: '/gst-calculator', icon: Calculator, desc: 'Calculate GST rates quickly' },
    { name: 'EMI Calculator', path: '/emi-calculator', icon: Calculator, desc: 'Plan your loan installments' },
    { name: 'Salary Calculator', path: '/salary-calculator', icon: Briefcase, desc: 'Calculate in-hand salary' },
  ],
  Utilities: [
    { name: 'Word Counter', path: '/word-counter', icon: FileDigit, desc: 'Count words and characters' },
    { name: 'Age Calculator', path: '/age-calculator', icon: Calculator, desc: 'Calculate exact age from DOB' },
  ],
  Developer: [
    { name: 'JSON Formatter', path: '/json-formatter', icon: Code, desc: 'Format and validate JSON' },
    { name: 'Base64 Encoder', path: '/base64-encoder-decoder', icon: Code, desc: 'Encode/decode base64 strings' },
  ],
  Documents: [
    { name: 'PDF Merger', path: '/pdf-merger', icon: FileText, desc: 'Combine multiple PDFs' },
    { name: 'Resume Builder', path: '/resume-builder', icon: FileText, desc: 'Create professional resumes' },
  ],
  Converters: [
    { name: 'Currency Converter', path: '/currency-converter', icon: RefreshCw, desc: 'Live exchange rates' },
    { name: 'Length Converter', path: '/length-converter', icon: RefreshCw, desc: 'Convert length units' },
  ],
  Science: [
    { name: 'Velocity Calculator', path: '/velocity-calculator', icon: Atom, desc: 'Calculate speed and velocity' },
    { name: 'Force Calculator', path: '/force-calculator', icon: Atom, desc: 'Calculate physics force' },
  ],
  Images: [
    { name: 'Image Compressor', path: '/image-compressor', icon: Image, desc: 'Reduce image file size' },
    { name: 'Image Resizer', path: '/image-resizer', icon: Image, desc: 'Resize image dimensions' },
  ]
};

const RelatedToolsSection = ({ currentCategory, currentPath }) => {
  const { activeUrls } = useActiveTools();
  const tools = CATEGORY_MAP[currentCategory] || CATEGORY_MAP['Utilities'];
  
  const filteredTools = tools
    .filter(t => t.path !== currentPath && (activeUrls.has(t.path) || Array.from(activeUrls).some(url => url.endsWith(t.path))))
    .slice(0, 3);

  if (filteredTools.length === 0) return null;

  return (
    <div className="mt-16 pt-12 border-t border-border">
      <h3 className="text-2xl font-bold mb-6">Related Tools You Might Like</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredTools.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <Link key={idx} to={tool.path}>
              <Card className="h-full hover:shadow-soft transition-smooth group cursor-pointer border-border">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                    <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{tool.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{tool.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedToolsSection;