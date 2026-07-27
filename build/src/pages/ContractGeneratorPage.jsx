import React, { useState } from 'react';
import { Download, Printer, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useDocumentStorage } from '@/hooks/useDocumentStorage.js';
import { exportToPDF } from '@/utils/pdfExportUtils.js';
import { TEMPLATES, getTemplateClass } from '@/utils/documentTemplates.js';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const DEFAULT_DATA = {
  title: 'NON-DISCLOSURE AGREEMENT',
  party1Name: 'Company A, LLC',
  party1Address: '123 Main St',
  party1Role: 'Disclosing Party',
  party2Name: 'John Consultant',
  party2Address: '456 Remote Way',
  party2Role: 'Receiving Party',
  effectiveDate: new Date().toISOString().split('T')[0],
  clauses: [
    { id: '1', title: '1. Confidential Information', content: 'Confidential Information means all non-public information.' }
  ],
  template: TEMPLATES.NDA
};

const ContractGeneratorPage = () => {
  const [data, setData] = useDocumentStorage('contract-generator-data', DEFAULT_DATA);
  const [isExporting, setIsExporting] = useState(false);

  const updateData = (field, value) => setData(prev => ({ ...prev, [field]: value }));

  const addClause = () => {
    updateData('clauses', [...data.clauses, { id: Date.now().toString(), title: `New Clause`, content: 'Enter clause text here.' }]);
  };

  const removeClause = (id) => updateData('clauses', data.clauses.filter(c => c.id !== id));
  
  const updateClause = (id, field, value) => {
    updateData('clauses', data.clauses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF('document-preview', `${data.title.replace(' ', '_')}.pdf`);
      toast.success('Contract exported as PDF');
    } catch (error) { toast.error('Failed to export PDF'); }
    setIsExporting(false);
  };

  return (
    <ToolPageTemplate toolData={toolPageData['contract-generator']}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Contract Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Contract Title</Label><Input value={data.title} onChange={e => updateData('title', e.target.value)} /></div>
                <div className="space-y-2"><Label>Effective Date</Label><Input type="date" value={data.effectiveDate} onChange={e => updateData('effectiveDate', e.target.value)} /></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-4">
                  <h3 className="font-semibold">Party 1</h3>
                  <div className="space-y-2"><Label>Name</Label><Input value={data.party1Name} onChange={e => updateData('party1Name', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Role</Label><Input value={data.party1Role} onChange={e => updateData('party1Role', e.target.value)} /></div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Party 2</h3>
                  <div className="space-y-2"><Label>Name</Label><Input value={data.party2Name} onChange={e => updateData('party2Name', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Role</Label><Input value={data.party2Role} onChange={e => updateData('party2Role', e.target.value)} /></div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex justify-between items-center"><Label className="text-lg font-semibold">Clauses & Terms</Label><Button size="sm" variant="outline" onClick={addClause}><Plus className="h-4 w-4 mr-1" /> Add</Button></div>
                {data.clauses.map((clause) => (
                  <div key={clause.id} className="bg-muted/50 p-4 rounded-lg space-y-3 relative group">
                    <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100" onClick={() => removeClause(clause.id)}><Trash2 className="h-4 w-4" /></Button>
                    <div className="pr-8"><Label>Heading</Label><Input value={clause.title} onChange={e => updateClause(clause.id, 'title', e.target.value)} /></div>
                    <div><Label>Content</Label><Textarea rows={3} value={clause.content} onChange={e => updateClause(clause.id, 'content', e.target.value)} /></div>
                  </div>
                ))}
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
            <div id="document-preview" className={`document-preview bg-white min-h-[800px] w-full max-w-[800px] mx-auto p-12 text-black ${getTemplateClass(data.template)} text-sm leading-relaxed`}>
              <h1 className="text-2xl font-bold text-center uppercase mb-8">{data.title}</h1>
              <p className="mb-6 text-justify">This Agreement is made effective as of <strong>{data.effectiveDate}</strong> by and between:</p>
              <div className="pl-8 mb-6 border-l-2 border-gray-300">
                <p><strong>{data.party1Name}</strong> ("{data.party1Role}")</p>
                <p className="my-2">AND</p>
                <p><strong>{data.party2Name}</strong> ("{data.party2Role}")</p>
              </div>
              <div className="space-y-6 mb-12">
                {data.clauses.map((clause) => (
                  <div key={clause.id} className="text-justify"><h3 className="font-bold mb-2">{clause.title}</h3><p>{clause.content}</p></div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-12 mt-12">
                <div><div className="border-b border-black h-12 mb-2"></div><p className="font-bold">{data.party1Name}</p></div>
                <div><div className="border-b border-black h-12 mb-2"></div><p className="font-bold">{data.party2Name}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default ContractGeneratorPage;