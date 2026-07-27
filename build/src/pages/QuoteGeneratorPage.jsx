import React, { useState } from 'react';
import { Download, Printer, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useDocumentStorage } from '@/hooks/useDocumentStorage.js';
import { useDocumentCalculations } from '@/hooks/useDocumentCalculations.js';
import { exportToPDF } from '@/utils/pdfExportUtils.js';
import { TEMPLATES, getTemplateClass } from '@/utils/documentTemplates.js';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const DEFAULT_DATA = {
  quoteNumber: `QT-${Math.floor(1000 + Math.random() * 9000)}`,
  date: new Date().toISOString().split('T')[0],
  validUntil: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
  businessName: 'My Company',
  clientName: 'Client Corp',
  items: [{ id: '1', name: 'Consulting Hours', quantity: 10, price: 150 }],
  discountRate: 0,
  taxRate: 10,
  notes: 'Thank you for the opportunity to quote.',
  template: TEMPLATES.PROFESSIONAL
};

const QuoteGeneratorPage = () => {
  const [data, setData] = useDocumentStorage('quote-generator-data', DEFAULT_DATA);
  const [isExporting, setIsExporting] = useState(false);

  const { subtotal, discountAmount, taxAmount, total } = useDocumentCalculations(data.items, data.taxRate, data.discountRate);

  const updateData = (field, value) => setData(prev => ({ ...prev, [field]: value }));
  const addItem = () => updateData('items', [...data.items, { id: Date.now().toString(), name: '', quantity: 1, price: 0 }]);
  const removeItem = (id) => updateData('items', data.items.filter(item => item.id !== id));
  const updateItem = (id, field, value) => updateData('items', data.items.map(item => item.id === id ? { ...item, [field]: value } : item));

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF('document-preview', `Quote_${data.quoteNumber}.pdf`);
      toast.success('Quote exported as PDF');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
    setIsExporting(false);
  };

  return (
    <ToolPageTemplate toolData={toolPageData['quote-generator']}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Quote Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Quote No.</Label><Input value={data.quoteNumber} onChange={e => updateData('quoteNumber', e.target.value)} /></div>
                <div className="space-y-2"><Label>Date</Label><Input type="date" value={data.date} onChange={e => updateData('date', e.target.value)} /></div>
                <div className="space-y-2"><Label>Valid Until</Label><Input type="date" value={data.validUntil} onChange={e => updateData('validUntil', e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Business Name</Label><Input value={data.businessName} onChange={e => updateData('businessName', e.target.value)} /></div>
                <div className="space-y-2"><Label>Client Name</Label><Input value={data.clientName} onChange={e => updateData('clientName', e.target.value)} /></div>
              </div>
              
              <div className="space-y-2 pt-4">
                <div className="flex justify-between items-center"><Label>Items</Label><Button size="sm" variant="outline" onClick={addItem}><Plus className="h-4 w-4 mr-1" /> Add</Button></div>
                {data.items.map((item) => (
                  <div key={item.id} className="flex gap-2 items-center bg-muted/50 p-2 rounded-lg">
                    <Input className="flex-1" placeholder="Item" value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} />
                    <Input className="w-20" type="number" placeholder="Qty" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', e.target.value)} />
                    <Input className="w-24" type="number" placeholder="Price" value={item.price} onChange={e => updateItem(item.id, 'price', e.target.value)} />
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2"><Label>Discount (%)</Label><Input type="number" value={data.discountRate} onChange={e => updateData('discountRate', e.target.value)} /></div>
                <div className="space-y-2"><Label>Tax Rate (%)</Label><Input type="number" value={data.taxRate} onChange={e => updateData('taxRate', e.target.value)} /></div>
              </div>
              
              <div className="space-y-2"><Label>Notes / Terms</Label><Textarea value={data.notes} onChange={e => updateData('notes', e.target.value)} /></div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-24 space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleExportPDF} disabled={isExporting}><Download className="h-4 w-4 mr-2" /> PDF</Button>
            <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4 mr-2" /> Print</Button>
          </div>

          <div className="bg-muted p-4 rounded-xl overflow-x-auto">
            <div id="document-preview" className="document-preview bg-white min-h-[600px] w-full max-w-[800px] mx-auto p-12 text-black font-sans">
              <div className="flex justify-between items-start border-b pb-6 mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 tracking-tight">QUOTE</h1>
                  <p className="text-gray-500 mt-2">#{data.quoteNumber}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold">{data.businessName}</h2>
                </div>
              </div>
              
              <div className="flex justify-between mb-10">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase">Quote For</p>
                  <p className="font-medium text-lg">{data.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm"><span className="font-bold text-gray-400 uppercase">Date:</span> {data.date}</p>
                  <p className="text-sm"><span className="font-bold text-gray-400 uppercase">Valid Until:</span> {data.validUntil}</p>
                </div>
              </div>

              <table className="w-full text-left mb-8">
                <thead>
                  <tr className="border-b-2 border-gray-800">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Unit Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map(item => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-3">{item.name}</td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right">${parseFloat(item.price).toFixed(2)}</td>
                      <td className="py-3 text-right">${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mb-12">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  {discountAmount > 0 && <div className="flex justify-between text-sm text-red-500"><span>Discount ({data.discountRate}%)</span><span>-${discountAmount.toFixed(2)}</span></div>}
                  {taxAmount > 0 && <div className="flex justify-between text-sm"><span>Tax ({data.taxRate}%)</span><span>${taxAmount.toFixed(2)}</span></div>}
                  <div className="flex justify-between text-xl font-bold border-t border-black pt-2 mt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </div>
              </div>

              {data.notes && (
                <div className="pt-8 border-t border-gray-200">
                  <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Notes & Terms</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{data.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default QuoteGeneratorPage;