import React, { useState } from 'react';
import { Download, FileText, Printer, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDocumentStorage } from '@/hooks/useDocumentStorage.js';
import { exportToPDF } from '@/utils/pdfExportUtils.js';
import { exportToDOCX } from '@/utils/docxExportUtils.js';
import { TEMPLATES, getTemplateClass } from '@/utils/documentTemplates.js';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const DEFAULT_DATA = {
  senderName: 'John Doe',
  senderAddress: '123 Sender St\nCity, State 12345',
  date: new Date().toISOString().split('T')[0],
  recipientName: 'Jane Smith',
  recipientAddress: '456 Recipient Ave\nCity, State 67890',
  subject: 'Regarding the upcoming project',
  greeting: 'Dear Jane,',
  body: 'I am writing to discuss the details of our upcoming project. It is crucial that we align our goals before the kickoff meeting next week.\n\nPlease review the attached documents and let me know your thoughts.',
  closing: 'Sincerely,',
  template: TEMPLATES.BUSINESS
};

const getFallbackData = () => ({
  toolName: 'Letter Generator',
  toolDescription: 'Format and generate professional letters easily.',
  whatToolDoes: 'Creates perfectly formatted business or formal letters based on your inputs.',
  whyUseful: ['Saves time formatting', 'Multiple professional templates', 'Export to PDF or DOCX'],
  howToUseSteps: ['Fill out sender and recipient details', 'Write your letter content', 'Choose a template style', 'Download or print'],
  howItWorks: 'Uses client-side templates to render and export your text beautifully without sending data to a server.',
  features: ['Real-time preview', 'PDF/DOCX export', 'Multiple layouts'],
  useCases: ['Business correspondence', 'Cover letters', 'Formal requests'],
  faqs: [{ question: 'Is it free?', answer: 'Yes, 100% free to use.' }],
  seoContent: 'Create professional business letters with our free online generator.',
  relatedTools: []
});

const LetterGeneratorPage = () => {
  const [data, setData] = useDocumentStorage('letter-generator-data', DEFAULT_DATA);
  const [isExporting, setIsExporting] = useState(false);

  const updateData = (field, value) => setData(prev => ({ ...prev, [field]: value }));

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF('document-preview', `Letter_${data.date}.pdf`);
      toast.success('Letter exported as PDF');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
    setIsExporting(false);
  };

  const handleExportDOCX = async () => {
    setIsExporting(true);
    try {
      const docData = [
        { text: data.senderName, bold: true },
        { text: data.senderAddress.replace(/\n/g, ', ') },
        { text: '' },
        { text: format(new Date(data.date), 'MMMM do, yyyy') },
        { text: '' },
        { text: data.recipientName, bold: true },
        { text: data.recipientAddress.replace(/\n/g, ', ') },
        { text: '' },
        { text: `Subject: ${data.subject}`, bold: true },
        { text: '' },
        { text: data.greeting },
        { text: '' },
        ...data.body.split('\n\n').map(p => ({ text: p })),
        { text: '' },
        { text: data.closing },
        { text: data.senderName }
      ];
      await exportToDOCX(docData, `Letter_${data.date}.docx`);
      toast.success('Letter exported as DOCX');
    } catch (error) {
      toast.error('Failed to export DOCX');
    }
    setIsExporting(false);
  };

  const handlePrint = () => window.print();

  const copyToClipboard = () => {
    const text = `${data.senderName}\n${data.senderAddress}\n\n${data.date}\n\n${data.recipientName}\n${data.recipientAddress}\n\nSubject: ${data.subject}\n\n${data.greeting}\n\n${data.body}\n\n${data.closing}\n${data.senderName}`;
    navigator.clipboard.writeText(text);
    toast.success('Letter copied to clipboard');
  };

  return (
    <ToolPageTemplate toolData={toolPageData['letter-generator'] || getFallbackData()}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Letter Contents</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Sender Name</Label><Input value={data.senderName} onChange={e => updateData('senderName', e.target.value)} /></div>
                <div className="space-y-2"><Label>Date</Label><Input type="date" value={data.date} onChange={e => updateData('date', e.target.value)} /></div>
              </div>
              <div className="space-y-2"><Label>Sender Address</Label><Textarea rows={2} value={data.senderAddress} onChange={e => updateData('senderAddress', e.target.value)} /></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2"><Label>Recipient Name</Label><Input value={data.recipientName} onChange={e => updateData('recipientName', e.target.value)} /></div>
                <div className="space-y-2"><Label>Subject / Re:</Label><Input value={data.subject} onChange={e => updateData('subject', e.target.value)} /></div>
              </div>
              <div className="space-y-2"><Label>Recipient Address</Label><Textarea rows={2} value={data.recipientAddress} onChange={e => updateData('recipientAddress', e.target.value)} /></div>

              <div className="space-y-2 pt-4 border-t"><Label>Greeting</Label><Input value={data.greeting} onChange={e => updateData('greeting', e.target.value)} placeholder="Dear [Name]," /></div>
              <div className="space-y-2"><Label>Letter Body</Label><Textarea rows={8} value={data.body} onChange={e => updateData('body', e.target.value)} /></div>
              <div className="space-y-2"><Label>Closing</Label><Input value={data.closing} onChange={e => updateData('closing', e.target.value)} placeholder="Sincerely," /></div>

              <div className="space-y-2 pt-4 border-t">
                <Label>Format Style</Label>
                <Select value={data.template} onValueChange={v => updateData('template', v)}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TEMPLATES.BUSINESS}>Business (Block Format)</SelectItem>
                    <SelectItem value={TEMPLATES.FORMAL}>Formal (Serif)</SelectItem>
                    <SelectItem value={TEMPLATES.INFORMAL}>Informal (Semi-block)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-24 space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleExportPDF} disabled={isExporting}><Download className="h-4 w-4 mr-2" /> PDF</Button>
            <Button variant="secondary" onClick={handleExportDOCX} disabled={isExporting}><FileText className="h-4 w-4 mr-2" /> DOCX</Button>
            <Button variant="outline" onClick={handlePrint}><Printer className="h-4 w-4 mr-2" /> Print</Button>
            <Button variant="outline" onClick={copyToClipboard}><Copy className="h-4 w-4" /></Button>
          </div>

          <div className="bg-muted p-4 rounded-xl overflow-x-auto">
            <div id="document-preview" className={`document-preview bg-white min-h-[800px] w-full max-w-[800px] mx-auto p-12 md:p-16 text-black ${getTemplateClass(data.template)} text-sm md:text-base leading-relaxed`}>
              
              {data.template === TEMPLATES.BUSINESS && (
                <div className="flex flex-col h-full">
                  <div className="mb-8">
                    <p className="font-bold">{data.senderName}</p>
                    <p className="whitespace-pre-line">{data.senderAddress}</p>
                  </div>
                  <p className="mb-8">{data.date ? format(new Date(data.date), 'MMMM do, yyyy') : ''}</p>
                  <div className="mb-8">
                    <p className="font-bold">{data.recipientName}</p>
                    <p className="whitespace-pre-line">{data.recipientAddress}</p>
                  </div>
                  {data.subject && <p className="mb-8 font-bold">RE: {data.subject}</p>}
                  <p className="mb-6">{data.greeting}</p>
                  <div className="mb-8 space-y-4">
                    {data.body.split('\n\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                  <div className="mt-8">
                    <p>{data.closing}</p>
                    <p className="mt-12 font-bold">{data.senderName}</p>
                  </div>
                </div>
              )}

              {data.template === TEMPLATES.FORMAL && (
                <div className="flex flex-col h-full">
                  <div className="text-right mb-12">
                    <p className="font-bold">{data.senderName}</p>
                    <p className="whitespace-pre-line">{data.senderAddress}</p>
                    <p className="mt-4">{data.date ? format(new Date(data.date), 'MMMM do, yyyy') : ''}</p>
                  </div>
                  <div className="mb-8">
                    <p className="font-bold">{data.recipientName}</p>
                    <p className="whitespace-pre-line">{data.recipientAddress}</p>
                  </div>
                  {data.subject && <p className="mb-8 font-bold uppercase text-center border-b border-black pb-2">Subject: {data.subject}</p>}
                  <p className="mb-6">{data.greeting}</p>
                  <div className="mb-8 space-y-4">
                    {data.body.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="indent-8">{paragraph}</p>
                    ))}
                  </div>
                  <div className="mt-8 ml-auto w-1/2">
                    <p>{data.closing}</p>
                    <p className="mt-16 font-bold">{data.senderName}</p>
                  </div>
                </div>
              )}

              {data.template === TEMPLATES.INFORMAL && (
                <div className="flex flex-col h-full">
                  <div className="text-right mb-8">
                    <p className="whitespace-pre-line text-gray-600">{data.senderAddress}</p>
                    <p className="mt-2 text-gray-600">{data.date ? format(new Date(data.date), 'MMMM do, yyyy') : ''}</p>
                  </div>
                  <p className="mb-6 font-medium">{data.greeting}</p>
                  <div className="mb-8 space-y-4">
                    {data.body.split('\n\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                  <div className="mt-8 text-right">
                    <p className="italic">{data.closing}</p>
                    <p className="mt-4 font-medium">{data.senderName}</p>
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

export default LetterGeneratorPage;