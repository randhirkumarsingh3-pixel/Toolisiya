import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const PasswordGeneratorPage = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [strength, setStrength] = useState({ label: 'Weak', color: 'bg-red-500' });
  const [bulkCount, setBulkCount] = useState(1);
  const [bulkPasswords, setBulkPasswords] = useState([]);

  const chars = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
    ambiguous: 'il1Lo0O'
  };

  const generatePassword = () => {
    if (!uppercase && !lowercase && !numbers && !symbols) {
      toast.error('Please select at least one character type.');
      return;
    }

    let charset = '';
    if (uppercase) charset += chars.uppercase;
    if (lowercase) charset += chars.lowercase;
    if (numbers) charset += chars.numbers;
    if (symbols) charset += chars.symbols;

    if (excludeAmbiguous) {
      charset = charset.split('').filter(c => !chars.ambiguous.includes(c)).join('');
    }

    let newPassword = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      newPassword += charset[array[i] % charset.length];
    }
    
    setPassword(newPassword);
    calculateStrength(newPassword, charset.length);
  };

  const generateBulk = () => {
    if (bulkCount < 1 || bulkCount > 100) {
      toast.error('Bulk generation limit is 1-100');
      return;
    }
    
    let charset = '';
    if (uppercase) charset += chars.uppercase;
    if (lowercase) charset += chars.lowercase;
    if (numbers) charset += chars.numbers;
    if (symbols) charset += chars.symbols;
    if (excludeAmbiguous) charset = charset.split('').filter(c => !chars.ambiguous.includes(c)).join('');

    const list = [];
    for(let j=0; j<bulkCount; j++) {
      let pwd = '';
      const array = new Uint32Array(length);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        pwd += charset[array[i] % charset.length];
      }
      list.push(pwd);
    }
    setBulkPasswords(list);
    if(list.length > 0) setPassword(list[0]);
    calculateStrength(list[0], charset.length);
    toast.success(`Generated ${bulkCount} passwords`);
  };

  const calculateStrength = (pwd, poolSize) => {
    const entropy = pwd.length * Math.log2(poolSize);
    if (entropy < 40) setStrength({ label: 'Weak', color: 'bg-red-500', width: '25%' });
    else if (entropy < 60) setStrength({ label: 'Medium', color: 'bg-yellow-500', width: '50%' });
    else if (entropy < 80) setStrength({ label: 'Strong', color: 'bg-green-500', width: '75%' });
    else setStrength({ label: 'Very Strong', color: 'bg-emerald-600', width: '100%' });
  };

  useEffect(() => {
    generatePassword();
  }, [length, uppercase, lowercase, numbers, symbols, excludeAmbiguous]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadBulk = () => {
    if (bulkPasswords.length === 0) return;
    const blob = new Blob([bulkPasswords.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'passwords.txt';
    a.click();
    toast.success('File downloaded');
  };

  const getFallbackData = () => ({
    toolName: 'Password Generator',
    toolDescription: 'Create strong, unpredictable passwords to keep your online accounts safe from hackers.',
    whatToolDoes: 'Generates secure, random passwords based on your specific criteria.',
    whyUseful: ['Enhances online security', 'Prevents brute-force attacks', 'Customizable length and characters'],
    howToUseSteps: ['Select desired password length', 'Choose character types (uppercase, numbers, etc.)', 'Click generate', 'Copy your new secure password'],
    howItWorks: 'Uses cryptographically secure random number generators to create unpredictable character sequences.',
    features: ['Up to 128 characters', 'Bulk generation', 'Strength indicator'],
    useCases: ['Creating new accounts', 'Updating old passwords', 'Generating API keys'],
    faqs: [{ question: 'Are the passwords saved?', answer: 'No, passwords are generated locally in your browser and never saved or transmitted.' }],
    seoContent: 'Generate secure, random passwords instantly with our free online password generator.',
    relatedTools: []
  });

  return (
    <ToolPageTemplate toolData={toolPageData['password-generator'] || getFallbackData()}>
      <Card className="border-border shadow-md border-t-8 border-t-primary mb-8 overflow-hidden">
        <CardContent className="p-8 pb-10 flex flex-col items-center bg-muted/10">
          <div className="w-full text-center relative mb-6">
            <div className="text-3xl md:text-5xl font-mono tracking-wider break-all bg-card p-6 rounded-xl border border-border shadow-inner text-foreground">
              {password}
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <Button size="lg" onClick={() => copyToClipboard(password)} className="w-40"><Copy className="h-4 w-4 mr-2" /> Copy</Button>
              <Button size="lg" variant="outline" onClick={generatePassword} className="w-40"><RefreshCw className="h-4 w-4 mr-2" /> Regenerate</Button>
            </div>
          </div>

          <div className="w-full max-w-md bg-card p-4 rounded-lg border border-border shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Security Strength</span>
              <span className="font-bold text-sm" style={{ color: strength.color.replace('bg-', 'text-') }}>{strength.label}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div className={`h-full ${strength.color} transition-all duration-500`} style={{ width: strength.width }}></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-sm">
          <CardHeader><CardTitle>Password Settings</CardTitle></CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="text-base">Password Length</Label>
                <span className="text-lg font-bold text-primary">{length}</span>
              </div>
              <Slider value={[length]} onValueChange={v => setLength(v[0])} min={8} max={128} step={1} />
            </div>

            <div className="space-y-4 bg-muted/20 p-4 rounded-xl border border-border">
              <div className="flex items-center space-x-3">
                <Checkbox id="uc" checked={uppercase} onCheckedChange={setUppercase} />
                <Label htmlFor="uc" className="text-base cursor-pointer">Uppercase (A-Z)</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="lc" checked={lowercase} onCheckedChange={setLowercase} />
                <Label htmlFor="lc" className="text-base cursor-pointer">Lowercase (a-z)</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="num" checked={numbers} onCheckedChange={setNumbers} />
                <Label htmlFor="num" className="text-base cursor-pointer">Numbers (0-9)</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="sym" checked={symbols} onCheckedChange={setSymbols} />
                <Label htmlFor="sym" className="text-base cursor-pointer">Symbols (!@#$)</Label>
              </div>
              <div className="flex items-center space-x-3 pt-2 border-t">
                <Checkbox id="amb" checked={excludeAmbiguous} onCheckedChange={setExcludeAmbiguous} />
                <Label htmlFor="amb" className="text-sm cursor-pointer">Exclude Ambiguous (i, l, 1, L, o, 0, O)</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader><CardTitle>Bulk Generate</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">Need multiple passwords at once? Generate a batch based on your current settings.</p>
            <div className="flex gap-4 items-end">
              <div className="space-y-2 flex-1">
                <Label>Quantity (1-100)</Label>
                <Input type="number" min="1" max="100" value={bulkCount} onChange={e => setBulkCount(parseInt(e.target.value) || 1)} />
              </div>
              <Button onClick={generateBulk} className="w-32">Generate</Button>
            </div>

            {bulkPasswords.length > 0 && (
              <div className="mt-6 border rounded-lg overflow-hidden flex flex-col h-64">
                <div className="bg-muted/50 p-2 border-b flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase px-2">{bulkPasswords.length} Passwords</span>
                  <Button variant="ghost" size="sm" onClick={downloadBulk} className="h-8"><Download className="h-3 w-3 mr-2"/> Export</Button>
                </div>
                <div className="p-2 overflow-y-auto flex-1 font-mono text-sm space-y-1 bg-card">
                  {bulkPasswords.map((p, i) => (
                    <div key={i} className="p-2 hover:bg-muted rounded flex justify-between items-center group cursor-pointer" onClick={() => copyToClipboard(p)}>
                      <span className="truncate">{p}</span>
                      <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default PasswordGeneratorPage;