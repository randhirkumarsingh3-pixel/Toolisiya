import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import FormulaDisplay from '@/components/FormulaDisplay.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const WaveSpeedCalculatorPage = () => {
  const [frequency, setFrequency] = useState('');
  const [wavelength, setWavelength] = useState('');
  const [speed, setSpeed] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const f = parseFloat(frequency);
    const w = parseFloat(wavelength);
    if (!isNaN(f) && !isNaN(w)) {
      setSpeed(f * w);
    } else {
      setSpeed(0);
    }
  }, [frequency, wavelength]);

  const handleCopy = () => {
    navigator.clipboard.writeText(speed.toFixed(4));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setFrequency('');
    setWavelength('');
  };

  return (
    <CalculatorLayout
      title="Wave Speed Calculator"
      description="Calculate the speed of a wave based on its frequency and wavelength."
      category="Science"
      categoryPath="/science"
      example={{
        description: "Calculate the wave speed if the frequency is 5 Hz and the wavelength is 2 meters.",
        steps: [
          { text: "Frequency (f) = 5 Hz" },
          { text: "Wavelength (λ) = 2 m" },
          { text: "v = 5 × 2" },
          { text: "Wave Speed = 10 m/s", highlight: true }
        ]
      }}
      faqs={[
        { question: "What is wave speed?", answer: "Wave speed is the distance a wave travels in a given amount of time, such as the number of meters it travels per second." },
        { question: "What is the relationship between frequency and wavelength?", answer: "For a given wave speed, frequency and wavelength are inversely proportional. If frequency increases, wavelength decreases." }
      ]}
    >
      <NavigationButtons />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-base">Input Values</Label>
              <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-muted-foreground">
                <RefreshCw className="h-4 w-4 mr-2" /> Clear
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Frequency (Hz)</Label>
              <Input type="number" value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="e.g., 5" min="0" step="any" />
            </div>
            <div className="space-y-2">
              <Label>Wavelength (meters)</Label>
              <Input type="number" value={wavelength} onChange={(e) => setWavelength(e.target.value)} placeholder="e.g., 2" min="0" step="any" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 flex flex-col items-center justify-center h-full min-h-[200px]">
            <p className="text-muted-foreground mb-2 font-medium">Wave Speed (v)</p>
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold text-primary">
                {speed.toFixed(4)}
              </span>
              <Button variant="outline" size="icon" onClick={handleCopy} disabled={!speed}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <span className="mt-2 text-sm text-muted-foreground">m/s</span>
          </CardContent>
        </Card>
      </div>

      <FormulaDisplay formula="v = f \times \lambda" description="v = wave speed, f = frequency, λ = wavelength" />
    </CalculatorLayout>
  );
};

export default WaveSpeedCalculatorPage;