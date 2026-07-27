import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import FormulaDisplay from '@/components/FormulaDisplay.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const PHCalculatorPage = () => {
  const [calculationType, setCalculationType] = useState('fromH');
  const [hConcentration, setHConcentration] = useState('');
  const [ohConcentration, setOhConcentration] = useState('');
  const [phValue, setPhValue] = useState('');
  const [pohValue, setPohValue] = useState('');
  
  const [results, setResults] = useState({
    pH: 0,
    pOH: 0,
    hPlus: 0,
    ohMinus: 0,
    nature: ''
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    calculatePH();
  }, [calculationType, hConcentration, ohConcentration, phValue, pohValue]);

  const calculatePH = () => {
    let pH, pOH, hPlus, ohMinus;

    try {
      switch (calculationType) {
        case 'fromH':
          const h = parseFloat(hConcentration);
          if (!isNaN(h) && h > 0) {
            pH = -Math.log10(h);
            pOH = 14 - pH;
            hPlus = h;
            ohMinus = Math.pow(10, -pOH);
          } else {
            return;
          }
          break;

        case 'fromOH':
          const oh = parseFloat(ohConcentration);
          if (!isNaN(oh) && oh > 0) {
            pOH = -Math.log10(oh);
            pH = 14 - pOH;
            ohMinus = oh;
            hPlus = Math.pow(10, -pH);
          } else {
            return;
          }
          break;

        case 'frompH':
          const pHVal = parseFloat(phValue);
          if (!isNaN(pHVal) && pHVal >= 0 && pHVal <= 14) {
            pH = pHVal;
            pOH = 14 - pH;
            hPlus = Math.pow(10, -pH);
            ohMinus = Math.pow(10, -pOH);
          } else {
            return;
          }
          break;

        case 'frompOH':
          const pOHVal = parseFloat(pohValue);
          if (!isNaN(pOHVal) && pOHVal >= 0 && pOHVal <= 14) {
            pOH = pOHVal;
            pH = 14 - pOH;
            hPlus = Math.pow(10, -pH);
            ohMinus = Math.pow(10, -pOH);
          } else {
            return;
          }
          break;

        default:
          return;
      }

      let nature = 'Neutral';
      if (pH < 7) nature = 'Acidic';
      if (pH > 7) nature = 'Basic (Alkaline)';

      setResults({
        pH: pH.toFixed(2),
        pOH: pOH.toFixed(2),
        hPlus: hPlus.toExponential(4),
        ohMinus: ohMinus.toExponential(4),
        nature
      });
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setHConcentration('');
    setOhConcentration('');
    setPhValue('');
    setPohValue('');
  };

  const getNatureColor = () => {
    if (results.nature === 'Acidic') return 'text-red-500';
    if (results.nature === 'Basic (Alkaline)') return 'text-blue-500';
    return 'text-green-500';
  };

  return (
    <CalculatorLayout
      title="pH Calculator"
      description="Calculate pH, pOH, and ion concentrations for chemical solutions"
    >
      <Helmet>
        <title>pH Calculator – Calculate pH of Solution Online Instantly</title>
        <meta name="description" content="Calculate pH instantly with our free pH Calculator. Determine acidity or alkalinity of solutions using concentration values easily." />
        <meta name="keywords" content="ph calculator, ph value calculator, acidity calculator, hydrogen ion concentration calculator, chemistry ph tool" />
        <link rel="canonical" href="https://toolisiya.com/science/ph-calculator" />
        <meta property="og:title" content="pH Calculator – Calculate pH of Solution Online Instantly" />
        <meta property="og:description" content="Calculate pH instantly with our free pH Calculator. Determine acidity or alkalinity of solutions using concentration values easily." />
        <meta property="og:url" content="https://toolisiya.com/science/ph-calculator" />
        <meta property="og:type" content="website" />
      </Helmet>

      <NavigationButtons />

      <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight mt-4">pH Calculator – Find Acidity or Alkalinity Easily</h1>

      <Tabs value={calculationType} onValueChange={setCalculationType} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="fromH">From [H⁺]</TabsTrigger>
          <TabsTrigger value="fromOH">From [OH⁻]</TabsTrigger>
          <TabsTrigger value="frompH">From pH</TabsTrigger>
          <TabsTrigger value="frompOH">From pOH</TabsTrigger>
        </TabsList>

        <TabsContent value="fromH" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-base">Input Values</Label>
                  <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-muted-foreground">
                    <RefreshCw className="h-4 w-4 mr-2" /> Clear
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Hydrogen Ion Concentration [H⁺] (mol/L)</Label>
                  <Input type="number" value={hConcentration} onChange={(e) => setHConcentration(e.target.value)} placeholder="e.g., 0.0001" min="0" step="any" />
                  <p className="text-xs text-muted-foreground">Enter concentration in scientific notation (e.g., 1e-7)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6 space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Solution Nature</p>
                  <p className={`text-2xl font-bold ${getNatureColor()}`}>{results.nature}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">pH</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-primary">{results.pH}</p>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(results.pH)}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="bg-background p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">pOH</p>
                    <p className="text-2xl font-bold">{results.pOH}</p>
                  </div>
                  <div className="bg-background p-4 rounded-lg col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">[OH⁻] Concentration</p>
                    <p className="text-lg font-mono">{results.ohMinus} mol/L</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fromOH" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-base">Input Values</Label>
                  <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-muted-foreground">
                    <RefreshCw className="h-4 w-4 mr-2" /> Clear
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Hydroxide Ion Concentration [OH⁻] (mol/L)</Label>
                  <Input type="number" value={ohConcentration} onChange={(e) => setOhConcentration(e.target.value)} placeholder="e.g., 0.0001" min="0" step="any" />
                  <p className="text-xs text-muted-foreground">Enter concentration in scientific notation (e.g., 1e-7)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6 space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Solution Nature</p>
                  <p className={`text-2xl font-bold ${getNatureColor()}`}>{results.nature}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">pH</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-primary">{results.pH}</p>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(results.pH)}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="bg-background p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">pOH</p>
                    <p className="text-2xl font-bold">{results.pOH}</p>
                  </div>
                  <div className="bg-background p-4 rounded-lg col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">[H⁺] Concentration</p>
                    <p className="text-lg font-mono">{results.hPlus} mol/L</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="frompH" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-base">Input Values</Label>
                  <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-muted-foreground">
                    <RefreshCw className="h-4 w-4 mr-2" /> Clear
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>pH Value</Label>
                  <Input type="number" value={phValue} onChange={(e) => setPhValue(e.target.value)} placeholder="e.g., 7.0" min="0" max="14" step="0.01" />
                  <p className="text-xs text-muted-foreground">pH scale ranges from 0 to 14</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6 space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Solution Nature</p>
                  <p className={`text-2xl font-bold ${getNatureColor()}`}>{results.nature}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">pOH</p>
                    <p className="text-2xl font-bold">{results.pOH}</p>
                  </div>
                  <div className="bg-background p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">[H⁺]</p>
                    <p className="text-sm font-mono">{results.hPlus}</p>
                  </div>
                  <div className="bg-background p-4 rounded-lg col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">[OH⁻] Concentration</p>
                    <p className="text-lg font-mono">{results.ohMinus} mol/L</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="frompOH" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-base">Input Values</Label>
                  <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-muted-foreground">
                    <RefreshCw className="h-4 w-4 mr-2" /> Clear
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>pOH Value</Label>
                  <Input type="number" value={pohValue} onChange={(e) => setPohValue(e.target.value)} placeholder="e.g., 7.0" min="0" max="14" step="0.01" />
                  <p className="text-xs text-muted-foreground">pOH scale ranges from 0 to 14</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6 space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Solution Nature</p>
                  <p className={`text-2xl font-bold ${getNatureColor()}`}>{results.nature}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">pH</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-primary">{results.pH}</p>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(results.pH)}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="bg-background p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">[OH⁻]</p>
                    <p className="text-sm font-mono">{results.ohMinus}</p>
                  </div>
                  <div className="bg-background p-4 rounded-lg col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">[H⁺] Concentration</p>
                    <p className="text-lg font-mono">{results.hPlus} mol/L</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Understanding Section */}
      <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm mt-12">
        <h2 className="text-2xl font-bold mb-4">Understanding the pH calculator</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            The pH Calculator is an essential tool in chemistry for measuring the acidity or alkalinity of solutions. pH stands for "power of hydrogen" and represents the concentration of hydrogen ions (H⁺) in a solution on a logarithmic scale from 0 to 14. A pH of 7 is considered neutral (pure water at 25°C), values below 7 indicate acidic solutions, and values above 7 indicate basic or alkaline solutions. This scale is fundamental to understanding chemical reactions, biological processes, and environmental conditions.
          </p>
          <p>
            The logarithmic nature of the pH scale means that each whole number change represents a tenfold change in hydrogen ion concentration. For example, a solution with pH 4 has ten times more hydrogen ions than a solution with pH 5, and one hundred times more than pH 6. This logarithmic relationship makes the pH scale particularly useful for expressing very small concentrations in a manageable range. The formula pH = -log₁₀[H⁺] converts the hydrogen ion concentration (typically a very small decimal number) into a simple number between 0 and 14.
          </p>
          <p>
            Understanding pH is crucial in numerous fields including chemistry, biology, medicine, environmental science, and industry. In biological systems, pH affects enzyme activity, protein structure, and cellular function – human blood, for instance, must maintain a pH between 7.35 and 7.45 for proper physiological function. In environmental monitoring, pH measurements help assess water quality, soil health, and pollution levels. Industrial processes from food production to pharmaceutical manufacturing rely on precise pH control to ensure product quality and safety. This calculator simplifies pH calculations, allowing scientists, students, and professionals to quickly determine solution properties and make informed decisions.
          </p>
        </div>
      </section>

      {/* Formulas Section */}
      <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Formulas & methodology</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">1. pH formula</h3>
            <FormulaDisplay formula="pH = -\log_{10}[H^+]" description="Calculate pH from hydrogen ion concentration" />
            <FormulaDisplay formula="[H^+] = 10^{-pH}" description="Calculate hydrogen ion concentration from pH" />
            <p className="text-sm text-muted-foreground mt-2">The pH is the negative logarithm (base 10) of the hydrogen ion concentration in moles per liter.</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">2. pOH formula</h3>
            <FormulaDisplay formula="pOH = -\log_{10}[OH^-]" description="Calculate pOH from hydroxide ion concentration" />
            <FormulaDisplay formula="[OH^-] = 10^{-pOH}" description="Calculate hydroxide ion concentration from pOH" />
            <p className="text-sm text-muted-foreground mt-2">The pOH is the negative logarithm (base 10) of the hydroxide ion concentration in moles per liter.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">3. pH and pOH relationship</h3>
            <FormulaDisplay formula="pH + pOH = 14" description="At 25°C (298 K)" />
            <FormulaDisplay formula="[H^+] \times [OH^-] = 1.0 \times 10^{-14}" description="Ion product of water at 25°C" />
            <p className="text-sm text-muted-foreground mt-2">At 25°C, the sum of pH and pOH always equals 14, and the product of hydrogen and hydroxide ion concentrations equals 1.0 × 10⁻¹⁴.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">4. pH of weak acids and bases</h3>
            <FormulaDisplay formula="pH = \frac{1}{2}(pK_a - \log C)" description="For weak acids" />
            <p className="text-sm text-muted-foreground mt-2">For weak acids, pH can be approximated using the acid dissociation constant (pKₐ) and the concentration (C). Similar formulas exist for weak bases using pKᵦ.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
        <h2 className="text-2xl font-bold mb-4">How it works</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <h3 className="font-semibold mb-1">Select calculation type</h3>
              <p className="text-muted-foreground text-sm">Choose whether you want to calculate pH from hydrogen ion concentration [H⁺], hydroxide ion concentration [OH⁻], pH value, or pOH value. Each tab provides a different starting point for your calculation.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <h3 className="font-semibold mb-1">Enter known value</h3>
              <p className="text-muted-foreground text-sm">Input the concentration or pH/pOH value you know. For concentrations, you can use scientific notation (e.g., 1e-7 for 0.0000001 mol/L). Ensure your values are within valid ranges (0-14 for pH/pOH, positive numbers for concentrations).</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</div>
            <div>
              <h3 className="font-semibold mb-1">Specify solution type</h3>
              <p className="text-muted-foreground text-sm">The calculator automatically determines whether your solution is acidic (pH &lt; 7), neutral (pH = 7), or basic/alkaline (pH &gt; 7) based on the calculated pH value. This classification helps you understand the chemical nature of your solution.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">4</div>
            <div>
              <h3 className="font-semibold mb-1">Get results</h3>
              <p className="text-muted-foreground text-sm">View all calculated values including pH, pOH, [H⁺], and [OH⁻] concentrations. The results display the solution nature (acidic/neutral/basic) with color coding for easy interpretation. You can copy any value for use in reports or further calculations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Tips & best practices</h2>
        <ul className="space-y-3 text-muted-foreground">
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>Understand the logarithmic scale – a change of 1 pH unit represents a tenfold change in hydrogen ion concentration, so pH 4 is ten times more acidic than pH 5, and pH 3 is one hundred times more acidic than pH 5.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>Remember that pH + pOH = 14 only at 25°C (298 K) – at different temperatures, this relationship changes because the ion product of water (Kw) is temperature-dependent, so always specify temperature when reporting pH values.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>Distinguish between strong and weak acids/bases – strong acids and bases completely dissociate in water, making pH calculations straightforward, while weak acids and bases require equilibrium calculations using Ka or Kb values.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>Use appropriate significant figures when reporting pH – pH values are typically reported to two decimal places (e.g., pH 7.42), as the precision of most pH measurements doesn't justify more decimal places, and the logarithmic nature limits meaningful precision.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>Calibrate pH meters regularly using standard buffer solutions – pH meters drift over time and require calibration with at least two buffers (typically pH 4.0, 7.0, and 10.0) to ensure accurate measurements across the pH range you're working with.</span>
          </li>
        </ul>
      </section>

      {/* Use Cases Section */}
      <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Common use cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Laboratory analysis</h3>
            <p className="text-muted-foreground text-sm">Chemists use pH calculations to prepare buffer solutions, monitor chemical reactions, determine acid-base equilibria, and analyze unknown solutions. Accurate pH control is essential for enzyme assays, protein purification, and analytical chemistry procedures.</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Environmental monitoring</h3>
            <p className="text-muted-foreground text-sm">Environmental scientists measure pH to assess water quality in rivers, lakes, and oceans, monitor soil health for agriculture, detect acid rain effects, and evaluate pollution levels. pH is a key indicator of ecosystem health and environmental change.</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Biological studies</h3>
            <p className="text-muted-foreground text-sm">Biologists and medical researchers monitor pH in cell culture media, blood samples, and bodily fluids to ensure proper physiological conditions. pH affects enzyme activity, protein folding, drug efficacy, and cellular metabolism in all living organisms.</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Industrial processes</h3>
            <p className="text-muted-foreground text-sm">Industries including food production, pharmaceuticals, water treatment, and chemical manufacturing rely on precise pH control for product quality, safety, and regulatory compliance. pH affects fermentation, drug stability, corrosion rates, and chemical synthesis.</p>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Frequently asked questions</h2>
        <div className="space-y-4">
          <details className="group border-b pb-4">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              What does pH mean and why is it called power of hydrogen?
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              pH stands for "power of hydrogen" or "potential of hydrogen," referring to the concentration of hydrogen ions (H⁺) in a solution. The term was introduced by Danish chemist Søren Sørensen in 1909. The "p" represents the mathematical operator "-log₁₀" (negative logarithm base 10), and "H" represents the hydrogen ion concentration. So pH literally means the negative logarithm of the hydrogen ion concentration, making it a convenient way to express very small concentrations on a manageable 0-14 scale.
            </p>
          </details>

          <details className="group border-b pb-4">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              Why does the pH scale go from 0 to 14?
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              The pH scale typically ranges from 0 to 14 because this covers the range of hydrogen ion concentrations commonly encountered in aqueous solutions at 25°C. At this temperature, pure water has a pH of 7 (neutral) because [H⁺] = [OH⁻] = 1.0 × 10⁻⁷ M. The scale extends from pH 0 (1 M H⁺, very acidic) to pH 14 (1 M OH⁻, very basic). However, pH values can technically go below 0 or above 14 for extremely concentrated acids or bases – for example, concentrated hydrochloric acid can have a pH around -1.
            </p>
          </details>

          <details className="group border-b pb-4">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              How do I calculate pH from hydrogen ion concentration?
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              To calculate pH from hydrogen ion concentration [H⁺], use the formula: pH = -log₁₀[H⁺]. For example, if [H⁺] = 1.0 × 10⁻⁵ M, then pH = -log₁₀(1.0 × 10⁻⁵) = -(-5) = 5. On a calculator, enter the concentration, press the log button, then multiply by -1. Remember that the concentration must be in moles per liter (M or mol/L). For very small concentrations, scientific notation makes calculations easier – our calculator accepts inputs like "1e-5" for 0.00001.
            </p>
          </details>

          <details className="group border-b pb-4">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              What is the difference between pH and pOH?
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              pH measures the concentration of hydrogen ions (H⁺) in a solution, while pOH measures the concentration of hydroxide ions (OH⁻). Both use the same logarithmic scale, but they represent opposite aspects of acidity/basicity. At 25°C, pH + pOH always equals 14 because of the ion product of water (Kw = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴). A low pH (high [H⁺]) corresponds to a high pOH (low [OH⁻]) in acidic solutions, while a high pH corresponds to a low pOH in basic solutions. Both scales provide the same information from different perspectives.
            </p>
          </details>

          <details className="group border-b pb-4">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              Can pH be negative or greater than 14?
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              Yes, pH can theoretically be negative or greater than 14, though this is rare and occurs only with extremely concentrated acids or bases. For example, a 10 M solution of hydrochloric acid (HCl) would have pH = -log₁₀(10) = -1. Similarly, a 10 M solution of sodium hydroxide (NaOH) would have pH ≈ 15. However, at such high concentrations, the simple pH formula becomes less accurate because of activity effects and non-ideal solution behavior. In practice, most solutions encountered in everyday chemistry fall within the 0-14 range, which is why this is considered the "normal" pH scale.
            </p>
          </details>

          <details className="group pb-4">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              How does temperature affect pH?
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              Temperature significantly affects pH because it changes the ion product of water (Kw). At 25°C, Kw = 1.0 × 10⁻¹⁴ and neutral pH = 7.0. At higher temperatures, Kw increases (water becomes more ionized), so neutral pH decreases – at 100°C, neutral pH is about 6.14. At lower temperatures, Kw decreases and neutral pH increases – at 0°C, neutral pH is about 7.47. This means pure water at 100°C with pH 6.14 is still neutral (not acidic) because [H⁺] = [OH⁻]. Always specify temperature when reporting pH values, and remember that pH + pOH = 14 only at 25°C.
            </p>
          </details>
        </div>
      </section>
    </CalculatorLayout>
  );
};

export default PHCalculatorPage;