import React, { useState, useRef } from 'react';
import { Download, FileImage, Printer, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDocumentStorage } from '@/hooks/useDocumentStorage.js';
import { exportToPDF } from '@/utils/pdfExportUtils.js';
import { exportToPNG } from '@/utils/imageExportUtils.js';
import { TEMPLATES, getTemplateClass } from '@/utils/documentTemplates.js';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const DEFAULT_DATA = {
  certificateNumber: `CERT-${Math.floor(10000 + Math.random() * 90000)}`,
  recipientName: 'Jane Smith',
  courseName: 'Advanced React Development',
  date: new Date().toISOString().split('T')[0],
  issuerName: 'John Doe, Lead Instructor',
  primaryColor: '#1d4ed8',
  logoUrl: '',
  template: TEMPLATES.PROFESSIONAL
};

const CertificateGeneratorPage = () => {
  const [data, setData] = useDocumentStorage('cert-generator-data', DEFAULT_DATA);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef(null);

  const updateData = (field, value) => setData(prev => ({ ...prev, [field]: value }));

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => updateData('logoUrl', event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF('document-preview', `Certificate_${data.recipientName.replace(' ', '_')}.pdf`);
      toast.success('Certificate exported as PDF');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
    setIsExporting(false);
  };

  const handleExportPNG = async () => {
    setIsExporting(true);
    try {
      await exportToPNG('document-preview', `Certificate_${data.recipientName.replace(' ', '_')}.png`);
      toast.success('Certificate exported as PNG');
    } catch (error) {
      toast.error('Failed to export PNG');
    }
    setIsExporting(false);
  };

  const handlePrint = () => window.print();

  return (
    <ToolPageTemplate toolData={toolPageData['certificate-generator']}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Recipient Name</Label><Input value={data.recipientName} onChange={e => updateData('recipientName', e.target.value)} /></div>
              <div className="space-y-2"><Label>Achievement / Course Name</Label><Input value={data.courseName} onChange={e => updateData('courseName', e.target.value)} /></div>
              <div className="space-y-2"><Label>Issuer Name / Title</Label><Input value={data.issuerName} onChange={e => updateData('issuerName', e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Date</Label><Input type="date" value={data.date} onChange={e => updateData('date', e.target.value)} /></div>
                <div className="space-y-2"><Label>Cert Number</Label><Input value={data.certificateNumber} onChange={e => updateData('certificateNumber', e.target.value)} /></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select value={data.template} onValueChange={v => updateData('template', v)}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TEMPLATES.PROFESSIONAL}>Professional</SelectItem>
                      <SelectItem value={TEMPLATES.ACADEMIC}>Academic</SelectItem>
                      <SelectItem value={TEMPLATES.ACHIEVEMENT}>Achievement</SelectItem>
                      <SelectItem value={TEMPLATES.APPRECIATION}>Appreciation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" className="w-12 p-1 h-10" value={data.primaryColor} onChange={e => updateData('primaryColor', e.target.value)} />
                    <Input value={data.primaryColor} onChange={e => updateData('primaryColor', e.target.value)} className="uppercase flex-1" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Label>Logo (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1">
                    <ImageIcon className="w-4 h-4 mr-2" /> Upload Logo
                  </Button>
                  {data.logoUrl && <Button variant="ghost" className="text-destructive" onClick={() => updateData('logoUrl', '')}>Remove</Button>}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="flex gap-2 flex-wrap justify-end">
            <Button onClick={handleExportPDF} disabled={isExporting}><Download className="h-4 w-4 mr-2" /> PDF</Button>
            <Button variant="secondary" onClick={handleExportPNG} disabled={isExporting}><FileImage className="h-4 w-4 mr-2" /> PNG</Button>
            <Button variant="outline" onClick={handlePrint}><Printer className="h-4 w-4 mr-2" /> Print</Button>
          </div>

          <div className="bg-muted p-4 rounded-xl overflow-x-auto flex justify-center">
            <div id="document-preview" className={`document-preview bg-white w-[1056px] h-[816px] relative overflow-hidden flex items-center justify-center p-12 text-black ${getTemplateClass(data.template)} shrink-0`} style={{ transform: 'scale(0.85)', transformOrigin: 'top center', marginBottom: '-100px' }}>
              
              {data.template === TEMPLATES.PROFESSIONAL && (
                <div className="w-full h-full border-[12px] p-8 flex flex-col justify-between items-center text-center" style={{ borderColor: data.primaryColor }}>
                  <div className="w-full border-2 p-12 h-full flex flex-col items-center justify-center" style={{ borderColor: data.primaryColor }}>
                    {data.logoUrl && <img src={data.logoUrl} alt="Logo" className="h-20 object-contain mb-8" />}
                    <h1 className="text-6xl font-serif text-gray-800 mb-6 uppercase tracking-widest">Certificate</h1>
                    <h2 className="text-2xl text-gray-500 uppercase tracking-widest mb-12">of Completion</h2>
                    <p className="text-lg italic text-gray-600 mb-4">This is to certify that</p>
                    <h3 className="text-5xl font-bold text-gray-900 mb-8" style={{ color: data.primaryColor }}>{data.recipientName}</h3>
                    <p className="text-lg text-gray-600 mb-4 max-w-2xl">has successfully completed the requirements for</p>
                    <h4 className="text-3xl font-semibold text-gray-800 mb-16">{data.courseName}</h4>
                    
                    <div className="flex justify-between w-full px-20 mt-auto">
                      <div className="text-center w-64 border-t-2 border-gray-400 pt-2">
                        <p className="font-semibold">{data.date ? format(new Date(data.date), 'PPP') : ''}</p>
                        <p className="text-sm text-gray-500 uppercase mt-1">Date</p>
                      </div>
                      <div className="text-center w-64 border-t-2 border-gray-400 pt-2">
                        <p className="font-semibold">{data.issuerName}</p>
                        <p className="text-sm text-gray-500 uppercase mt-1">Signature</p>
                      </div>
                    </div>
                    <p className="absolute bottom-6 right-6 text-xs text-gray-400">ID: {data.certificateNumber}</p>
                  </div>
                </div>
              )}

              {data.template === TEMPLATES.ACADEMIC && (
                <div className="w-full h-full border-double border-8 p-12 flex flex-col items-center relative" style={{ borderColor: data.primaryColor, backgroundColor: '#fcfcfc' }}>
                  <div className="absolute top-0 left-0 w-full h-32 opacity-10 bg-gradient-to-b from-black to-transparent"></div>
                  <div className="relative z-10 flex flex-col items-center w-full h-full justify-center text-center">
                    {data.logoUrl && <img src={data.logoUrl} alt="Logo" className="h-24 object-contain mb-10" />}
                    <h1 className="text-7xl font-serif mb-4" style={{ color: data.primaryColor }}>Diploma of Excellence</h1>
                    <p className="text-xl mb-12 uppercase tracking-widest text-gray-700">Presented To</p>
                    <h2 className="text-6xl font-serif italic text-gray-900 border-b border-gray-300 pb-4 mb-8 px-16 inline-block">{data.recipientName}</h2>
                    <p className="text-xl text-gray-700 mb-4">For outstanding academic achievement in</p>
                    <h3 className="text-4xl font-bold text-gray-800 mb-20">{data.courseName}</h3>
                    
                    <div className="flex justify-between w-full px-12 mt-auto text-lg font-serif">
                      <div className="text-center">
                        <p className="italic mb-2">{data.date ? format(new Date(data.date), 'PPP') : ''}</p>
                        <div className="w-48 border-t border-black pt-1">Date Awarded</div>
                      </div>
                      <div className="text-center">
                        <p className="italic mb-2 font-bold">{data.issuerName}</p>
                        <div className="w-64 border-t border-black pt-1">Authorized Signature</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {data.template === TEMPLATES.ACHIEVEMENT && (
                <div className="w-full h-full relative p-16 flex flex-col text-left">
                  <div className="absolute top-0 left-0 w-full h-4" style={{ backgroundColor: data.primaryColor }}></div>
                  <div className="absolute top-0 left-0 w-4 h-full" style={{ backgroundColor: data.primaryColor }}></div>
                  {data.logoUrl && <img src={data.logoUrl} alt="Logo" className="h-16 object-contain absolute top-12 right-16" />}
                  <div className="mt-8">
                    <p className="text-2xl font-bold uppercase tracking-widest text-gray-400 mb-2">Certificate of</p>
                    <h1 className="text-6xl font-extrabold uppercase mb-16" style={{ color: data.primaryColor }}>Achievement</h1>
                    <p className="text-xl text-gray-600 mb-4">Proudly presented to</p>
                    <h2 className="text-5xl font-bold text-gray-900 mb-12">{data.recipientName}</h2>
                    <p className="text-xl text-gray-600 mb-4">in recognition of</p>
                    <h3 className="text-3xl font-medium text-gray-800 mb-24 max-w-3xl">{data.courseName}</h3>
                    
                    <div className="flex gap-24 mt-auto border-t-2 pt-6" style={{ borderColor: data.primaryColor }}>
                      <div>
                        <p className="font-bold text-lg">{data.date ? format(new Date(data.date), 'PPP') : ''}</p>
                        <p className="text-sm text-gray-500 uppercase">Date</p>
                      </div>
                      <div>
                        <p className="font-bold text-lg">{data.issuerName}</p>
                        <p className="text-sm text-gray-500 uppercase">Issuer</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-sm text-gray-400 mt-6">{data.certificateNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {data.template === TEMPLATES.APPRECIATION && (
                <div className="w-full h-full bg-gray-50 p-6">
                  <div className="w-full h-full border border-dashed border-4 border-gray-300 p-12 flex flex-col items-center text-center justify-center relative">
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                       <div className="w-20 h-20 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: data.primaryColor }}>
                         <ImageIcon className="w-10 h-10" />
                       </div>
                    </div>
                    <h1 className="text-5xl font-light tracking-[0.3em] uppercase text-gray-800 mt-24 mb-12">Certificate of Appreciation</h1>
                    <p className="text-lg text-gray-600 mb-6 italic">We hereby express our sincere appreciation to</p>
                    <h2 className="text-5xl font-serif font-bold text-gray-900 mb-8 pb-4 border-b-2" style={{ borderColor: data.primaryColor }}>{data.recipientName}</h2>
                    <p className="text-lg text-gray-600 mb-4 max-w-2xl">for their valuable contribution and dedication to</p>
                    <h3 className="text-3xl font-medium text-gray-800 mb-16">{data.courseName}</h3>
                    
                    <div className="flex justify-between w-full px-24 mt-auto">
                      <div className="text-center w-48">
                        <p className="text-gray-800 font-medium pb-2 border-b border-gray-400">{data.date ? format(new Date(data.date), 'PPP') : ''}</p>
                        <p className="text-sm text-gray-500 uppercase mt-2">Date</p>
                      </div>
                      <div className="text-center w-64">
                        <p className="text-gray-800 font-medium pb-2 border-b border-gray-400">{data.issuerName}</p>
                        <p className="text-sm text-gray-500 uppercase mt-2">Signed</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default CertificateGeneratorPage;