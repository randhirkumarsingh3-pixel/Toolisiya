import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Ruler, Weight, Thermometer, Beaker, DollarSign, Image as ImageIcon, Music, Video, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ToolCard from '@/components/ToolCard.jsx';
import StickyNavigation from '@/components/StickyNavigation.jsx';

const ConvertersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const tools = [
    { id: 'length-converter', name: 'Length Converter', path: '/converters/length-converter', description: 'Convert between meters, feet, inches, miles, and more.', icon: Ruler },
    { id: 'weight-converter', name: 'Weight Converter', path: '/converters/weight-converter', description: 'Convert between kilograms, pounds, ounces, and grams.', icon: Weight },
    { id: 'temperature-converter', name: 'Temperature Converter', path: '/converters/temperature-converter', description: 'Convert between Celsius, Fahrenheit, and Kelvin.', icon: Thermometer },
    { id: 'volume-converter', name: 'Volume Converter', path: '/converters/volume-converter', description: 'Convert between liters, gallons, cups, and milliliters.', icon: Beaker },
    { id: 'currency-converter', name: 'Currency Converter', path: '/finance/currency-converter', description: 'Convert between global currencies with live exchange rates.', icon: DollarSign },
    { id: 'image-converter', name: 'Image Converter', path: '/image/image-converter', description: 'Convert images between JPG, PNG, WebP, GIF, and BMP formats.', icon: ImageIcon },
    { id: 'audio-converter', name: 'Audio Converter', path: '/converters/audio-converter', description: 'Convert audio files between MP3, WAV, OGG, and FLAC.', icon: Music },
    { id: 'video-converter', name: 'Video Converter', path: '/converters/video-converter', description: 'Convert videos between MP4, WebM, and OGG formats.', icon: Video },
    { id: 'word-to-pdf', name: 'Word to PDF', path: '/pdf/word-to-pdf', description: 'Convert Microsoft Word documents to PDF format.', icon: FileText },
    { id: 'excel-to-pdf', name: 'Excel to PDF', path: '/pdf/excel-to-pdf', description: 'Convert Microsoft Excel spreadsheets to PDF format.', icon: FileText },
  ];

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Unit, File & Currency Converters - Toolisiya.com</title>
        <meta name="description" content="Free online unit converters for length, weight, temperature, volume, live currency exchange rates, and file formats." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 py-12 bg-muted/30">
          <StickyNavigation />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 tracking-tight">Converters</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Fast and accurate unit, currency, and file conversions.
              </p>
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search converters..." 
                  className="pl-10 h-12 text-base bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool, index) => (
                <ToolCard key={tool.id} tool={tool} index={index} />
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No tools found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ConvertersPage;