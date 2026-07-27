import React, { useState } from 'react';
import { Download, FileImage, Printer, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDocumentStorage } from '@/hooks/useDocumentStorage.js';
import { useDocumentCalculations } from '@/hooks/useDocumentCalculations.js';
import { exportToPDF } from '@/utils/pdfExportUtils.js';
import { exportToPNG } from '@/utils/imageExportUtils.js';
import { TEMPLATES, getTemplateClass } from '@/utils/documentTemplates.js';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const DEFAULT_DATA = {
  receiptNumber: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
  date: new Date().toISOString().split('T')[0],
  businessName: 'My Awesome Business',
  businessAddress: '123 Main St, City, Country',
  customerName: 'John Doe',
  items: [{ id: '1', name: 'Service A', quantity: 1, price: 1000 }],
  paymentMethod: 'Credit Card',
  notes: 'Thank you for your business!',
  template: TEMPLATES.MODERN
};

const ReceiptGeneratorPage = () => {
  const [data, setData] = useDocumentStorage('receipt-generator-data', DEFAULT_DATA);
  const [isExporting, setIsExporting] = useState(false);

  const { total } = useDocumentCalculations(data.items, 0, 0);

  const updateData = (field, value) => setData(prev => ({ ...prev, [field]: value }));
  const addItem = () => updateData('items', [...data.items, { id: Date.now().toString(), name: '', quantity: 1, price: 0 }]);
  const removeItem = (id) => updateData('items', data.items.filter(item => item.id !== id));
  const updateItem = (id, field, value) => updateData('items', data.items.map(item => item.id === id ? { ...item, [field]: value } : item));

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF('document-preview', `Receipt_${data.receiptNumber}.pdf`);
      toast.success('Receipt exported as PDF');
    } catch (error) { toast.error('Failed to export PDF'); }
    setIsExporting(false);
  };

  const handleExportPNG = async () => {
    setIsExporting(true);
    try {
      await exportToPNG('document-preview', `Receipt_${data.receiptNumber}.png`);
      toast.success('Receipt exported as PNG');
    } catch (error) { toast.error('Failed to export PNG'); }
    setIsExporting(false);
  };

  return (
    <ToolPageTemplate toolData={toolPageData['receipt-generator']}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <Card className="shadow-sm border-border">
            <CardHeader className="bg-muted/30 border-b pb-4"><CardTitle>Receipt Details</CardTitle></CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Receipt No.</Label><Input value={data.receiptNumber} onChange={e => updateData('receiptNumber', e.target.value)} /></div>
                <div className="space-y-2"><Label>Date</Label><Input type="date" value={data.date} onChange={e => updateData('date', e.target.value)} /></div>
              </div>
              <div className="space-y-2"><Label>Business Name</Label><Input value={data.businessName} onChange={e => updateData('businessName', e.target.value)} /></div>
              <div className="space-y-2"><Label>Customer Name</Label><Input value={data.customerName} onChange={e => updateData('customerName', e.target.value)} /></div>
              
              <div className="space-y-2 pt-4 border-t mt-2">
                <div className="flex justify-between items-center"><Label className="text-base font-bold">Line Items</Label><Button size="sm" variant="outline" onClick={addItem}><Plus className="h-4 w-4 mr-2" /> Add</Button></div>
                {data.items.map((item) => (
                  <div key={item.id} className="flex gap-2 items-center bg-muted/20 border border-border/50 p-3 rounded-lg">
                    <Input className="flex-1" placeholder="Item name" value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} />
                    <Input className="w-20" type="number" placeholder="Qty" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', e.target.value)} />
                    <Input className="w-28" type="number" placeholder="Price" value={item.price} onChange={e => updateItem(item.id, 'price', e.target.value)} />
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t mt-4">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={data.paymentMethod} onValueChange={v => updateData('paymentMethod', v)}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap bg-card p-4 rounded-xl border shadow-sm">
            <Button onClick={handleExportPDF} disabled={isExporting} className="font-bold flex-1"><Download className="h-4 w-4 mr-2" /> PDF</Button>
            <Button variant="secondary" onClick={handleExportPNG} disabled={isExporting} className="flex-1"><FileImage className="h-4 w-4 mr-2" /> PNG</Button>
            <Button variant="outline" onClick={() => window.print()} className="flex-1"><Printer className="h-4 w-4 mr-2" /> Print</Button>
          </div>

          <div className="bg-muted p-4 md:p-8 rounded-xl overflow-x-auto shadow-inner border border-border/50">
            <div id="document-preview" className={`document-preview bg-white min-h-[600px] w-full max-w-[800px] mx-auto p-8 text-black shadow-md ${getTemplateClass(data.template)}`}>
              <div className="flex justify-between items-start border-b-4 border-slate-900 pb-6">
                <div>
                  <h1 className="text-4xl font-extrabold uppercase tracking-widest">Receipt</h1>
                  <p className="text-sm font-bold mt-2">#{data.receiptNumber}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold">{data.businessName}</h2>
                </div>
              </div>
              <div className="flex justify-between bg-slate-50 p-4 rounded-lg mt-4">
                <div><p className="text-xs font-bold uppercase tracking-wider">Billed To</p><p className="font-bold text-lg mt-1">{data.customerName}</p></div>
                <div className="text-right"><p className="text-xs font-bold uppercase tracking-wider">Date</p><p className="font-bold text-lg mt-1">{data.date}</p></div>
              </div>
              <table className="w-full text-left border-collapse mt-8">
                <thead>
                  <tr className="border-b-2 border-slate-300">
                    <th className="py-3 font-bold text-sm uppercase tracking-wider">Item</th>
                    <th className="py-3 font-bold text-sm uppercase tracking-wider text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100">
                      <td className="py-4 font-medium">{item.name} x{item.quantity}</td>
                      <td className="py-4 font-bold text-right">₹ {(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end pt-6">
                <div className="w-1/2 space-y-4">
                  <div className="flex justify-between items-center text-2xl font-black border-t-2 border-slate-900 pt-4"><span>Total</span><span>₹ {total.toFixed(2)}</span></div>
                  <div className="flex justify-between items-center text-sm font-medium bg-slate-100 p-2 rounded"><span>Method</span><span className="uppercase">{data.paymentMethod}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default ReceiptGeneratorPage;