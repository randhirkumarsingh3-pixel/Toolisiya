import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Printer, Upload } from 'lucide-react';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const InvoiceGeneratorPage = () => {
  const [invoice, setInvoice] = useState({
    invoiceNumber: `INV-${new Date().getFullYear()}-001`,
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    fromName: '',
    fromAddress: '',
    fromEmail: '',
    toName: '',
    toAddress: '',
    toEmail: '',
    items: [{ description: '', quantity: 1, rate: 0 }],
    taxRate: 0,
    notes: 'Thank you for your business!'
  });
  
  const [logoPreview, setLogoPreview] = useState(null);
  const previewRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoice.items];
    newItems[index][field] = value;
    setInvoice({ ...invoice, items: newItems });
  };

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { description: '', quantity: 1, rate: 0 }]
    });
  };

  const removeItem = (index) => {
    if (invoice.items.length === 1) return;
    const newItems = invoice.items.filter((_, i) => i !== index);
    setInvoice({ ...invoice, items: newItems });
  };

  const calculateSubtotal = () => {
    return invoice.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.rate)), 0);
  };

  const subtotal = calculateSubtotal();
  const taxAmount = (subtotal * Number(invoice.taxRate)) / 100;
  const total = subtotal + taxAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <ToolPageTemplate toolData={toolPageData['invoice-generator']}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left: Form Editor Section */}
        <div className="space-y-6">
          <Card className="shadow-sm border-border">
            <CardHeader className="bg-muted/30 pb-4 border-b">
              <CardTitle className="text-xl">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label className="text-muted-foreground">Company Logo</Label>
                <div className="flex items-center gap-4">
                  {logoPreview && (
                    <div className="w-16 h-16 rounded border flex items-center justify-center overflow-hidden bg-white">
                      <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                  <div className="relative">
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoUpload} 
                      className="hidden" 
                      id="logo-upload"
                    />
                    <Button variant="outline" asChild>
                      <label htmlFor="logo-upload" className="cursor-pointer flex items-center">
                        <Upload className="w-4 h-4 mr-2" /> 
                        {logoPreview ? 'Change Logo' : 'Upload Logo'}
                      </label>
                    </Button>
                  </div>
                  {logoPreview && (
                    <Button variant="ghost" size="sm" onClick={() => setLogoPreview(null)} className="text-destructive">
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              {/* Header Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Invoice No.</Label>
                  <Input 
                    value={invoice.invoiceNumber} 
                    onChange={e => setInvoice({...invoice, invoiceNumber: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input 
                    type="date" 
                    value={invoice.date} 
                    onChange={e => setInvoice({...invoice, date: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input 
                    type="date" 
                    value={invoice.dueDate} 
                    onChange={e => setInvoice({...invoice, dueDate: e.target.value})} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                {/* Billed By */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">From (Your Business)</h3>
                  <Input placeholder="Your Company Name" value={invoice.fromName} onChange={e => setInvoice({...invoice, fromName: e.target.value})} />
                  <Textarea placeholder="Your Address" value={invoice.fromAddress} onChange={e => setInvoice({...invoice, fromAddress: e.target.value})} rows={2} />
                  <Input placeholder="Email or Phone" value={invoice.fromEmail} onChange={e => setInvoice({...invoice, fromEmail: e.target.value})} />
                </div>

                {/* Billed To */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">To (Client)</h3>
                  <Input placeholder="Client Company Name" value={invoice.toName} onChange={e => setInvoice({...invoice, toName: e.target.value})} />
                  <Textarea placeholder="Client Address" value={invoice.toAddress} onChange={e => setInvoice({...invoice, toAddress: e.target.value})} rows={2} />
                  <Input placeholder="Client Email" value={invoice.toEmail} onChange={e => setInvoice({...invoice, toEmail: e.target.value})} />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <h3 className="font-semibold text-foreground">Line Items</h3>
                
                {invoice.items.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-muted/20 p-3 rounded-lg border">
                    <Input placeholder="Description" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="flex-1" />
                    <div className="flex gap-3 w-full sm:w-auto">
                      <Input type="number" min="1" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="w-20 text-right" />
                      <Input type="number" min="0" placeholder="Price" value={item.rate} onChange={e => handleItemChange(index, 'rate', e.target.value)} className="w-24 text-right" />
                      <Button variant="ghost" size="icon" onClick={() => removeItem(index)} className="text-destructive shrink-0" disabled={invoice.items.length === 1}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button variant="outline" onClick={addItem} className="w-full border-dashed">
                  <Plus className="w-4 h-4 mr-2" /> Add Item
                </Button>
              </div>

              {/* Tax & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input type="number" min="0" value={invoice.taxRate} onChange={e => setInvoice({...invoice, taxRate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Notes / Terms</Label>
                  <Textarea value={invoice.notes} onChange={e => setInvoice({...invoice, notes: e.target.value})} rows={2} />
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Right: Live Preview Section */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <div className="flex justify-end bg-card p-4 rounded-xl border shadow-sm print:hidden">
            <Button onClick={handlePrint} className="font-bold shadow-sm">
              <Printer className="w-4 h-4 mr-2" /> Print / Save PDF
            </Button>
          </div>

          {/* Invoice Template (Print Area) */}
          <div className="bg-muted p-4 md:p-8 rounded-xl border overflow-x-auto print:p-0 print:border-none print:bg-transparent">
            <div 
              ref={previewRef}
              className="print-area bg-white min-h-[700px] w-full max-w-[800px] mx-auto p-8 md:p-12 text-black shadow-md print:shadow-none"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              {/* Template Header */}
              <div className="flex justify-between items-start border-b-2 border-gray-200 pb-8 mb-8">
                <div className="w-1/2">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Company Logo" className="max-h-20 mb-4 object-contain" />
                  ) : (
                    <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center mb-4 border text-gray-400 text-xs uppercase">Logo</div>
                  )}
                  <h2 className="text-xl font-bold text-gray-900">{invoice.fromName || 'Your Company Name'}</h2>
                  <p className="text-gray-500 text-sm whitespace-pre-wrap mt-1">{invoice.fromAddress || 'Company Address'}</p>
                  <p className="text-gray-500 text-sm mt-1">{invoice.fromEmail}</p>
                </div>
                <div className="text-right">
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">INVOICE</h1>
                  <div className="mt-4 text-sm">
                    <p className="flex justify-end gap-4"><span className="text-gray-500 font-medium">Invoice No:</span> <span className="font-bold">{invoice.invoiceNumber}</span></p>
                    <p className="flex justify-end gap-4 mt-1"><span className="text-gray-500 font-medium">Date:</span> <span className="font-bold">{invoice.date}</span></p>
                    {invoice.dueDate && (
                      <p className="flex justify-end gap-4 mt-1"><span className="text-gray-500 font-medium">Due Date:</span> <span className="font-bold">{invoice.dueDate}</span></p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bill To */}
              <div className="mb-10">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To:</p>
                <h3 className="text-lg font-bold text-gray-900">{invoice.toName || 'Client Name'}</h3>
                <p className="text-gray-600 text-sm whitespace-pre-wrap mt-1">{invoice.toAddress || 'Client Address'}</p>
                <p className="text-gray-600 text-sm mt-1">{invoice.toEmail}</p>
              </div>

              {/* Items Table */}
              <table className="w-full text-left border-collapse mb-8">
                <thead>
                  <tr className="bg-gray-50 border-y border-gray-200">
                    <th className="py-3 px-4 font-bold text-gray-700 text-sm uppercase">Description</th>
                    <th className="py-3 px-4 font-bold text-gray-700 text-sm uppercase text-center w-24">Qty</th>
                    <th className="py-3 px-4 font-bold text-gray-700 text-sm uppercase text-right w-32">Rate</th>
                    <th className="py-3 px-4 font-bold text-gray-700 text-sm uppercase text-right w-32">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-4 px-4 text-gray-800">{item.description || 'Item description'}</td>
                      <td className="py-4 px-4 text-gray-800 text-center">{item.quantity}</td>
                      <td className="py-4 px-4 text-gray-800 text-right">
                        {Number(item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-gray-900 font-medium text-right">
                        {(Number(item.quantity) * Number(item.rate)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end mb-12">
                <div className="w-72 space-y-3">
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Subtotal:</span>
                    <span className="font-medium">{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {Number(invoice.taxRate) > 0 && (
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>Tax ({invoice.taxRate}%):</span>
                      <span className="font-medium">{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-t-2 border-gray-900 pt-3 mt-3">
                    <span className="font-bold text-gray-900 text-lg">Total:</span>
                    <span className="font-black text-gray-900 text-xl">
                      {total.toLocaleString('en-IN', { minimumFractionDigits: 2, style: 'currency', currency: 'INR' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div className="pt-8 border-t border-gray-200">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notes & Terms</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </ToolPageTemplate>
  );
};

export default InvoiceGeneratorPage;