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
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const DEFAULT_DATA = {
  billNumber: `BILL-${Math.floor(1000 + Math.random() * 9000)}`,
  date: new Date().toISOString().split('T')[0],
  businessName: 'Your Business Name',
  customerName: 'Client Name',
  items: [{ id: '1', name: 'Web Development Services', quantity: 1, price: 15000 }],
  taxRate: 18,
  notes: 'Payment due within 15 days. Thank you for your business!'
};

const BillGeneratorPage = () => {
  const [data, setData] = useDocumentStorage('bill-generator-data', DEFAULT_DATA);
  const [isExporting, setIsExporting] = useState(false);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(700);
  const containerRef = React.useRef(null);

  const { subtotal, taxAmount, total } = useDocumentCalculations(data.items, data.taxRate, 0);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const containerWidth = entry.contentRect.width;
        const previewEl = document.getElementById('document-preview');
        if (previewEl) {
          const originalHeight = previewEl.scrollHeight;
          const targetWidth = 800;
          const newScale = containerWidth < targetWidth ? (containerWidth / targetWidth) : 1;
          setScale(newScale);
          setScaledHeight(originalHeight * newScale);
        }
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [data.items, data.taxRate, data.notes, data.businessName, data.customerName, data.billNumber, data.date]);

  const updateData = (field, value) => setData(prev => ({ ...prev, [field]: value }));
  const addItem = () => updateData('items', [...data.items, { id: Date.now().toString(), name: '', quantity: 1, price: 0 }]);
  const removeItem = (id) => updateData('items', data.items.filter(item => item.id !== id));
  const updateItem = (id, field, value) => updateData('items', data.items.map(item => item.id === id ? { ...item, [field]: value } : item));

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF('document-preview', `Bill_${data.billNumber}.pdf`);
      toast.success('Bill exported as PDF');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
    setIsExporting(false);
  };

  return (
    <ToolPageTemplate toolData={toolPageData['bill-generator']}>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start mb-12">
        <div className="space-y-6">
          <Card className="shadow-lg border-border">
            <CardHeader className="bg-muted/30 border-b pb-4"><CardTitle>Bill Details</CardTitle></CardHeader>
            <CardContent className="space-y-5 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Bill No.</Label><Input value={data.billNumber} onChange={e => updateData('billNumber', e.target.value)} /></div>
                <div className="space-y-2"><Label>Date</Label><Input type="date" value={data.date} onChange={e => updateData('date', e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Your Business Name</Label><Input value={data.businessName} onChange={e => updateData('businessName', e.target.value)} /></div>
                <div className="space-y-2"><Label>Billed To</Label><Input value={data.customerName} onChange={e => updateData('customerName', e.target.value)} /></div>
              </div>
              
              <div className="space-y-3 pt-4">
                <div className="flex justify-between items-center"><Label className="text-base">Line Items</Label><Button size="sm" variant="outline" onClick={addItem} className="font-medium"><Plus className="h-4 w-4 mr-1" /> Add Item</Button></div>
                {data.items.map((item) => (
                  <div key={item.id} className="flex gap-2 items-center bg-muted/40 p-3 rounded-xl border border-border/50">
                    <Input className="flex-1 bg-background" placeholder="Description" value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} />
                    <Input className="w-20 bg-background" type="number" placeholder="Qty" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', e.target.value)} />
                    <div className="relative w-28">
                      <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">₹</span>
                      <Input className="pl-7 bg-background" type="number" placeholder="Price" value={item.price} onChange={e => updateItem(item.id, 'price', e.target.value)} />
                    </div>
                    <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10 shrink-0" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2"><Label>Tax Rate (%)</Label><Input type="number" value={data.taxRate} onChange={e => updateData('taxRate', e.target.value)} /></div>
              </div>
              <div className="space-y-2"><Label>Notes / Terms</Label><Textarea value={data.notes} onChange={e => updateData('notes', e.target.value)} className="resize-none" rows={3} /></div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:sticky xl:top-24 space-y-4">
          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleExportPDF} disabled={isExporting} className="font-bold flex-1 sm:flex-none shadow-sm"><Download className="h-4 w-4 mr-2" /> {isExporting ? 'Exporting...' : 'Download PDF'}</Button>
            <Button variant="outline" onClick={() => window.print()} className="flex-1 sm:flex-none bg-card"><Printer className="h-4 w-4 mr-2" /> Print</Button>
          </div>

          <div ref={containerRef} className="bg-muted/50 p-4 sm:p-6 rounded-2xl border border-border shadow-inner overflow-hidden">
            <div style={{
              width: '100%',
              height: scaledHeight ? `${scaledHeight}px` : '700px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div
                id="document-preview"
                className="document-preview bg-white min-h-[700px] w-[800px] absolute left-1/2 p-12 text-slate-900 font-sans border-t-[12px] border-primary shadow-sm rounded-sm"
                style={{
                  transform: `translateX(-50%) scale(${scale})`,
                  transformOrigin: 'top center',
                  top: 0
                }}
              >
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h1 className="text-5xl font-extrabold text-slate-900 tracking-tighter mb-2">BILL</h1>
                  <p className="text-lg text-slate-500 font-medium">#{data.billNumber}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-primary tracking-tight">{data.businessName}</h2>
                  <p className="text-slate-500 mt-2 font-medium">Date: {data.date}</p>
                </div>
              </div>
              
              <div className="mb-10 bg-slate-50 p-5 rounded-lg border border-slate-100">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Bill To</p>
                <p className="text-xl font-bold text-slate-800">{data.customerName}</p>
              </div>

              <table className="w-full text-left mb-10 border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-600 uppercase text-xs tracking-wider">
                    <th className="py-4 px-2 font-bold">Description</th>
                    <th className="py-4 px-2 font-bold text-center w-24">Qty</th>
                    <th className="py-4 px-2 font-bold text-right w-32">Rate</th>
                    <th className="py-4 px-2 font-bold text-right w-36">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {data.items.map(item => (
                    <tr key={item.id} className="border-b border-slate-100 last:border-b-0">
                      <td className="py-4 px-2 font-medium">{item.name}</td>
                      <td className="py-4 px-2 text-center">{item.quantity}</td>
                      <td className="py-4 px-2 text-right">₹{parseFloat(item.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="py-4 px-2 text-right font-bold text-slate-900">₹{((item.quantity || 0) * (item.price || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mb-12">
                <div className="w-72 bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <div className="flex justify-between text-sm mb-3 font-medium text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {taxAmount > 0 && (
                    <div className="flex justify-between text-sm mb-3 font-medium text-slate-600">
                      <span>Tax ({data.taxRate}%)</span>
                      <span>₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-2xl font-extrabold border-t-2 border-slate-200 pt-3 mt-3 text-primary">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {data.notes && (
                <div className="pt-8 border-t border-slate-200">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Notes</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{data.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </ToolPageTemplate>
  );
};

export default BillGeneratorPage;