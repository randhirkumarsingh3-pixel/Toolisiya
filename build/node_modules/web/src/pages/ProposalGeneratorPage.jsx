import React, { useState } from 'react';
import { Download, Printer, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDocumentStorage } from '@/hooks/useDocumentStorage.js';
import { useDocumentCalculations } from '@/hooks/useDocumentCalculations.js';
import { exportToPDF } from '@/utils/pdfExportUtils.js';
import { TEMPLATES, getTemplateClass } from '@/utils/documentTemplates.js';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const DEFAULT_DATA = {
  clientName: 'Acme Corp',
  projectTitle: 'Website Redesign Proposal',
  projectDescription: 'We propose a complete overhaul of your digital presence, focusing on user experience, modern aesthetics, and performance optimization.',
  services: [
    { id: '1', name: 'UI/UX Design', price: 2500 },
    { id: '2', name: 'Frontend Development', price: 4000 }
  ],
  timeline: 'Estimated completion in 6 weeks.',
  terms: '50% upfront payment. Valid for 30 days.',
  proposerName: 'Creative Agency LLC',
  template: TEMPLATES.CREATIVE
};

const ProposalGeneratorPage = () => {
  const [data, setData] = useDocumentStorage('proposal-generator-data', DEFAULT_DATA);
  const [isExporting, setIsExporting] = useState(false);

  const { subtotal } = useDocumentCalculations(data.services.map(s => ({ quantity: 1, price: s.price })), 0, 0);

  const updateData = (field, value) => setData(prev => ({ ...prev, [field]: value }));
  const addService = () => updateData('services', [...data.services, { id: Date.now().toString(), name: '', price: 0 }]);
  const removeService = (id) => updateData('services', data.services.filter(s => s.id !== id));
  const updateService = (id, field, value) => updateData('services', data.services.map(s => s.id === id ? { ...s, [field]: value } : s));

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF('document-preview', `Proposal_${data.clientName.replace(' ', '_')}.pdf`);
      toast.success('Proposal exported as PDF');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
    setIsExporting(false);
  };

  return (
    <ToolPageTemplate toolData={toolPageData['proposal-generator']}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Proposal Info</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Proposer (You)</Label><Input value={data.proposerName} onChange={e => updateData('proposerName', e.target.value)} /></div>
                <div className="space-y-2"><Label>Client Name</Label><Input value={data.clientName} onChange={e => updateData('clientName', e.target.value)} /></div>
              </div>
              <div className="space-y-2"><Label>Project Title</Label><Input value={data.projectTitle} onChange={e => updateData('projectTitle', e.target.value)} /></div>
              <div className="space-y-2"><Label>Executive Summary</Label><Textarea rows={4} value={data.projectDescription} onChange={e => updateData('projectDescription', e.target.value)} /></div>
              
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between items-center"><Label>Deliverables & Pricing</Label><Button size="sm" variant="outline" onClick={addService}><Plus className="h-4 w-4 mr-1" /> Add</Button></div>
                {data.services.map((service) => (
                  <div key={service.id} className="flex gap-2 items-center">
                    <Input className="flex-1" placeholder="Service Name" value={service.name} onChange={e => updateService(service.id, 'name', e.target.value)} />
                    <Input className="w-32" type="number" placeholder="Price" value={service.price} onChange={e => updateService(service.id, 'price', e.target.value)} />
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => removeService(service.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t"><Label>Timeline</Label><Input value={data.timeline} onChange={e => updateData('timeline', e.target.value)} /></div>
              <div className="space-y-2"><Label>Terms & Conditions</Label><Textarea rows={2} value={data.terms} onChange={e => updateData('terms', e.target.value)} /></div>
              
              <div className="space-y-2 pt-4 border-t">
                <Label>Template</Label>
                <Select value={data.template} onValueChange={v => updateData('template', v)}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TEMPLATES.PROFESSIONAL}>Professional</SelectItem>
                    <SelectItem value={TEMPLATES.CREATIVE}>Creative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-24 space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleExportPDF} disabled={isExporting}><Download className="h-4 w-4 mr-2" /> PDF</Button>
            <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4 mr-2" /> Print</Button>
          </div>

          <div className="bg-muted p-4 rounded-xl overflow-x-auto">
            <div id="document-preview" className={`document-preview bg-white min-h-[800px] w-full max-w-[800px] mx-auto p-12 text-black ${getTemplateClass(data.template)}`}>
              {data.template === TEMPLATES.PROFESSIONAL && (
                <div>
                  <div className="border-b-2 border-black pb-8 mb-8">
                    <h1 className="text-4xl font-bold mb-2">Project Proposal</h1>
                    <h2 className="text-2xl text-gray-600">{data.projectTitle}</h2>
                  </div>
                  <div className="flex justify-between mb-12">
                    <div>
                      <p className="text-sm font-bold uppercase text-gray-500">Prepared For:</p>
                      <p className="font-medium text-lg">{data.clientName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold uppercase text-gray-500">Prepared By:</p>
                      <p className="font-medium text-lg">{data.proposerName}</p>
                    </div>
                  </div>
                  <div className="mb-10">
                    <h3 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4">Executive Summary</h3>
                    <p className="text-gray-700 leading-relaxed">{data.projectDescription}</p>
                  </div>
                  <div className="mb-10">
                    <h3 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4">Deliverables & Investment</h3>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="py-2">Description</th>
                          <th className="py-2 text-right">Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.services.map(s => (
                          <tr key={s.id} className="border-b border-gray-100">
                            <td className="py-3">{s.name}</td>
                            <td className="py-3 text-right">${parseFloat(s.price).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="text-right mt-4 text-xl font-bold">Total Investment: ${subtotal.toFixed(2)}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 mb-12">
                    <div>
                      <h3 className="font-bold border-b border-gray-300 pb-1 mb-2">Timeline</h3>
                      <p className="text-sm text-gray-700">{data.timeline}</p>
                    </div>
                    <div>
                      <h3 className="font-bold border-b border-gray-300 pb-1 mb-2">Terms</h3>
                      <p className="text-sm text-gray-700">{data.terms}</p>
                    </div>
                  </div>
                  <div className="mt-16 pt-8 border-t border-gray-200 grid grid-cols-2 gap-12">
                    <div>
                      <div className="border-b border-black h-8 mb-2"></div>
                      <p className="text-sm font-bold">{data.clientName} Acceptance</p>
                    </div>
                  </div>
                </div>
              )}

              {data.template === TEMPLATES.CREATIVE && (
                <div className="relative">
                  <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                  <div className="pl-10">
                    <h1 className="text-5xl font-extrabold text-primary mb-2">{data.projectTitle}</h1>
                    <p className="text-xl text-gray-500 mb-12">A Proposal for {data.clientName}</p>
                    
                    <div className="bg-gray-50 p-6 rounded-lg mb-10 border-l-4 border-primary">
                      <h3 className="text-lg font-bold mb-2">The Vision</h3>
                      <p className="text-gray-700 leading-relaxed">{data.projectDescription}</p>
                    </div>

                    <h3 className="text-2xl font-bold mb-6 text-primary">Scope of Work</h3>
                    <div className="space-y-4 mb-10">
                      {data.services.map(s => (
                        <div key={s.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                          <span className="font-medium text-lg">{s.name}</span>
                          <span className="font-bold text-gray-700">${parseFloat(s.price).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center p-4 mt-2 border-t-2 border-gray-200">
                        <span className="font-bold text-xl uppercase tracking-wider">Total</span>
                        <span className="font-bold text-2xl text-primary">${subtotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-12">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-bold text-primary mb-2 uppercase text-sm tracking-wider">Timeline</h3>
                        <p className="text-gray-700">{data.timeline}</p>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-bold text-primary mb-2 uppercase text-sm tracking-wider">Terms</h3>
                        <p className="text-gray-700">{data.terms}</p>
                      </div>
                    </div>

                    <div className="mt-16 flex justify-between items-end">
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Proposed By</p>
                        <p className="font-bold text-xl">{data.proposerName}</p>
                      </div>
                      <div className="w-64">
                        <div className="border-b-2 border-gray-300 h-8 mb-2"></div>
                        <p className="text-sm font-bold text-gray-500 text-center">Client Signature</p>
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

export default ProposalGeneratorPage;