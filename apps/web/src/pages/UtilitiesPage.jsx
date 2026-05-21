import React, { useState } from 'react';
import { Search, Type, Percent, Calendar, Key, Hash, FileType, Code2, Pipette, ScanLine, FileJson, Speech, Mic, Link2, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ToolCard from '@/components/ToolCard.jsx';
import SEOHead from '@/components/SEOHead.jsx';

const UtilitiesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const tools = [
    { id: 'word-counter', name: 'Word Counter', path: '/developer/word-counter', description: 'Count words, characters, sentences, and paragraphs in real-time. Free • No Sign-up Required.', icon: FileType },
    { id: 'xml-formatter', name: 'XML Formatter', path: '/developer/xml-formatter', description: 'Format and beautify XML strings instantly. Free • No Sign-up Required.', icon: Code2 },
    { id: 'code-beautifier', name: 'Code Beautifier', path: '/developer/code-beautifier', description: 'Format source code in multiple languages. Free • No Sign-up Required.', icon: Code2 },
    { id: 'color-picker', name: 'Color Picker', path: '/developer/color-picker', description: 'Extract and convert colors between formats. Free • No Sign-up Required.', icon: Pipette },
    { id: 'barcode-generator', name: 'Barcode Generator', path: '/generator/barcode-generator', description: 'Generate high-quality barcodes for your products. Free • No Sign-up Required.', icon: ScanLine },
    { id: 'qr-code-generator', name: 'QR Code Generator', path: '/generator/qr-code-generator', description: 'Create custom QR codes instantly. Free • No Sign-up Required.', icon: ScanLine },
    { id: 'text-to-speech', name: 'Text to Speech', path: '/developer/text-to-speech', description: 'Convert written text into spoken audio. Free • No Sign-up Required.', icon: Speech },
    { id: 'speech-to-text', name: 'Speech to Text', path: '/developer/speech-to-text', description: 'Transcribe spoken audio into written text. Free • No Sign-up Required.', icon: Mic },
    { id: 'password-generator', name: 'Password Generator', path: '/generator/password-generator', description: 'Generate secure, random passwords with custom requirements. Free • No Sign-up Required.', icon: Key },
    { id: 'uuid-generator', name: 'UUID Generator', path: '/developer/uuid-generator', description: 'Generate robust UUIDs quickly. Free • No Sign-up Required.', icon: Hash },
    { id: 'base64-encoder-decoder', name: 'Base64 Encoder', path: '/developer/base64-encoder-decoder', description: 'Encode or decode strings and files in Base64 format. Free • No Sign-up Required.', icon: Code2 },
    { id: 'json-formatter', name: 'JSON Formatter', path: '/developer/json-formatter', description: 'Beautify, minify, and validate JSON data. Free • No Sign-up Required.', icon: FileJson },
    { id: 'markdown-to-html', name: 'Markdown to HTML', path: '/developer/markdown-to-html', description: 'Convert Markdown text to HTML seamlessly. Free • No Sign-up Required.', icon: FileType },
    { id: 'slug-generator', name: 'Slug Generator', path: '/generator/slug-generator', description: 'Convert text into URL-friendly slugs instantly. Free • No Sign-up Required.', icon: Link2 },
    { id: 'random-name-generator', name: 'Random Name Generator', path: '/generator/random-name-generator', description: 'Generate random names for characters, projects, or testing. Free • No Sign-up Required.', icon: Users },
    { id: 'science-calculator', name: 'Scientific Calculators', path: '/science', description: 'Access advanced scientific calculation tools. Free • No Sign-up Required.', icon: Hash },
  ];

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SEOHead 
        defaultTitle="Everyday Utilities & Developer Tools - Free Online | Toolisiya"
        defaultDescription="Access our free utility tools to generate passwords, format JSON/XML, count words, and encode data. Secure and fast. Free • No Sign-up Required."
        keywords="utilities, developer tools, word counter, password generator, json formatter, xml formatter, base64 encoder, slug generator, random name generator, free online tools"
      />
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 py-12 bg-muted/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 tracking-tight text-foreground">Utilities & Developer Tools</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Handy developer tools and utilities for everyday formatting, generating, and calculating tasks.
                <span className="block mt-2 font-medium text-primary text-sm">Free • No Sign-up Required</span>
              </p>
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search utilities..." 
                  className="pl-10 h-12 text-base bg-background shadow-sm"
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

export default UtilitiesPage;