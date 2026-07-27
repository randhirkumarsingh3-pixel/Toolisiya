import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const conversionRates = {
  mm: 0.001, cm: 0.01, m: 1, km: 1000,
  inch: 0.0254, foot: 0.3048, yard: 0.9144, mile: 1609.344
};

const LengthConverterPage = () => {
  const [amount, setAmount] = useState('1');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('foot');
  const [result, setResult] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (amount && !isNaN(amount)) {
      const baseInMeters = parseFloat(amount) * conversionRates[fromUnit];
      setResult(baseInMeters / conversionRates[toUnit]);
    } else {
      setResult(0);
    }
  }, [amount, fromUnit, toUnit]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${amount} ${fromUnit} = ${result.toFixed(4)} ${toUnit}`);
    setCopied(true);
    toast('Result copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Length Converter – Convert Length Units Online</title>
        <meta name="description" content="Convert length units instantly with our free Length Converter. Convert between meters, feet, inches, kilometers, miles, and more." />
        <meta name="keywords" content="length converter, distance converter, unit converter, meter to feet, kilometer to miles" />
        <link rel="canonical" href="https://toolisiya.com/utilities/length-converter" />
        <meta property="og:title" content="Length Converter – Convert Length Units Online" />
        <meta property="og:description" content="Convert length units instantly with our free Length Converter. Convert between meters, feet, inches, kilometers, miles, and more." />
        <meta property="og:url" content="https://toolisiya.com/utilities/length-converter" />
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <BreadcrumbNavigation customTitle="Length Converter" />
          <NavigationButtons />

          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Length Converter – Convert Length Units</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">Convert between millimeters, centimeters, meters, kilometers, inches, feet, yards, and miles instantly with precision.</p>
          </div>

          <Card className="mb-12 shadow-lg">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle>Convert Length</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="h-12 text-lg" />
                </div>
                <div className="space-y-2">
                  <Label>From</Label>
                  <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(conversionRates).map(unit => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-start-2">
                  <Label>To</Label>
                  <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(conversionRates).map(unit => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-primary/5 border-primary/20 rounded-xl p-6 flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">{amount} {fromUnit} equals</div>
                  <div className="text-3xl font-bold text-primary">{result.toFixed(4)} {toUnit}</div>
                </div>
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Understanding Section */}
          <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Understanding the length converter</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The Length Converter is an essential tool for converting measurements between different units of length and distance. Length is one of the fundamental physical quantities, representing the measurement of distance between two points. Whether you're working with the metric system (meters, centimeters, kilometers) or imperial system (feet, inches, miles), this converter provides instant, accurate conversions to help you work seamlessly across different measurement standards used worldwide.
              </p>
              <p>
                Understanding length conversions is crucial in many fields including construction, engineering, science, travel, and everyday life. The metric system, based on powers of ten, is used by most countries and in scientific work, making conversions straightforward (1 kilometer = 1000 meters, 1 meter = 100 centimeters). The imperial system, primarily used in the United States, has less intuitive relationships (1 mile = 5280 feet, 1 foot = 12 inches). Our converter handles both systems effortlessly, allowing you to work with whichever units are most appropriate for your task.
              </p>
              <p>
                Accurate length conversion is essential for international collaboration, travel planning, construction projects, and scientific research. A small conversion error in construction can lead to costly mistakes, while incorrect distance calculations in travel can cause confusion. This converter ensures precision with multiple decimal places, helping you maintain accuracy whether you're converting building dimensions, calculating travel distances, or working on scientific measurements. The tool's real-time conversion feature lets you see results instantly as you adjust values, making it easy to compare measurements and verify calculations.
              </p>
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Features & functionality</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="font-semibold">Feature</Badge>
                  <h3 className="font-semibold text-lg">Multiple Unit Support</h3>
                </div>
                <p className="text-muted-foreground text-sm">Convert between eight common length units including millimeters, centimeters, meters, kilometers, inches, feet, yards, and miles. Supports both metric and imperial systems for maximum flexibility.</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="font-semibold">Feature</Badge>
                  <h3 className="font-semibold text-lg">Bidirectional Conversion</h3>
                </div>
                <p className="text-muted-foreground text-sm">Convert in any direction between supported units. Switch from meters to feet, feet to kilometers, or any other combination with ease. The converter handles all unit pairs automatically.</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="font-semibold">Feature</Badge>
                  <h3 className="font-semibold text-lg">Real-time Conversion</h3>
                </div>
                <p className="text-muted-foreground text-sm">See conversion results update instantly as you type or change units. No need to click a convert button – results appear immediately, making it easy to experiment with different values and units.</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="font-semibold">Feature</Badge>
                  <h3 className="font-semibold text-lg">Decimal Precision</h3>
                </div>
                <p className="text-muted-foreground text-sm">Results display with four decimal places for high precision, essential for scientific calculations and engineering work. The converter maintains accuracy even with very small or very large measurements.</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="font-semibold">Feature</Badge>
                  <h3 className="font-semibold text-lg">Conversion History</h3>
                </div>
                <p className="text-muted-foreground text-sm">Copy conversion results to your clipboard with one click for easy pasting into documents, spreadsheets, or other applications. The formatted result includes both the input and output values for clarity.</p>
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
                  <h3 className="font-semibold mb-1">Select Source Unit</h3>
                  <p className="text-muted-foreground text-sm">Choose the unit you're converting from using the "From" dropdown menu. Select from metric units (mm, cm, m, km) or imperial units (inch, foot, yard, mile) based on your measurement.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-semibold mb-1">Enter Value</h3>
                  <p className="text-muted-foreground text-sm">Type the length measurement you want to convert in the "Amount" field. You can enter whole numbers or decimals. The converter accepts any positive number and updates results in real-time as you type.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-semibold mb-1">Select Target Unit</h3>
                  <p className="text-muted-foreground text-sm">Choose the unit you want to convert to using the "To" dropdown menu. You can convert between any two units – the converter automatically handles the mathematical conversion using precise conversion factors.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="font-semibold mb-1">Get Result</h3>
                  <p className="text-muted-foreground text-sm">View the converted value displayed with four decimal places for precision. The result updates instantly whenever you change the amount or units. Click the copy button to copy the full conversion statement to your clipboard.</p>
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
                <span>Remember common conversions for quick mental math: 1 meter ≈ 3.28 feet, 1 kilometer ≈ 0.62 miles, 1 inch = 2.54 centimeters. These approximations are useful for rough estimates when precision isn't critical.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Use metric units (meters, centimeters, kilometers) for scientific work and international projects. The metric system's base-10 structure makes calculations simpler and is the standard in most countries and scientific fields worldwide.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Double-check critical measurements before finalizing construction, manufacturing, or engineering projects. A small conversion error can lead to costly mistakes. Always verify your conversions, especially when working with large quantities or precise specifications.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Understand the difference between length and distance. Length typically refers to the measurement of an object from end to end, while distance refers to the space between two points. Both use the same units and conversion factors.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Use appropriate precision for your context. Four decimal places are useful for scientific work, but for everyday measurements like room dimensions or travel distances, rounding to one or two decimal places is usually sufficient and more practical.</span>
              </li>
            </ul>
          </section>

          {/* Use Cases Section */}
          <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Common use cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Construction</h3>
                <p className="text-muted-foreground text-sm">Convert building dimensions, material lengths, and site measurements between metric and imperial units. Essential for international construction projects, ordering materials from different countries, and ensuring accurate specifications across different measurement systems.</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Travel</h3>
                <p className="text-muted-foreground text-sm">Calculate distances for trip planning, understand road signs in different countries, and convert between miles and kilometers for navigation. Helps travelers understand distances when visiting countries that use different measurement systems.</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Sports</h3>
                <p className="text-muted-foreground text-sm">Convert track and field measurements, swimming pool lengths, and race distances. Essential for understanding international sporting events where distances may be reported in different units, and for comparing athletic performances across different measurement standards.</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Science</h3>
                <p className="text-muted-foreground text-sm">Perform precise length conversions for laboratory work, research data, and scientific calculations. Scientists often need to convert between units when collaborating internationally or when working with equipment calibrated in different measurement systems.</p>
              </div>
            </div>
          </section>

          {/* FAQs Section */}
          <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Frequently asked questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">What is the difference between metric and imperial systems?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  The metric system (also called SI or International System of Units) uses meters as the base unit for length and is based on powers of ten, making conversions straightforward (1 km = 1000 m, 1 m = 100 cm). The imperial system, primarily used in the United States, uses feet, inches, yards, and miles with less intuitive relationships (1 mile = 5280 feet, 1 foot = 12 inches). Most countries worldwide use the metric system, while the US, Liberia, and Myanmar primarily use imperial units.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">How many feet are in a meter?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  One meter equals approximately 3.28084 feet. For quick mental math, you can use the approximation that 1 meter ≈ 3.3 feet. Conversely, one foot equals approximately 0.3048 meters or about 30.48 centimeters. This conversion is commonly needed when working with building dimensions, height measurements, or when traveling between countries using different measurement systems.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">How many kilometers are in a mile?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  One mile equals approximately 1.60934 kilometers. For quick estimates, you can use 1 mile ≈ 1.6 km. Conversely, one kilometer equals approximately 0.621371 miles, or roughly 0.62 miles. This conversion is essential for travel, understanding road signs in different countries, and converting between speed limits (mph vs km/h). Many GPS devices and mapping applications can display distances in either unit.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">What is the SI unit of length?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  The meter (m) is the SI (International System of Units) base unit for length. It is defined as the distance light travels in a vacuum in 1/299,792,458 of a second. All other metric length units are derived from the meter using decimal prefixes: millimeter (mm) = 0.001 m, centimeter (cm) = 0.01 m, kilometer (km) = 1000 m. The meter is used worldwide in science, engineering, and most countries for everyday measurements.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">How do I convert inches to centimeters?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  To convert inches to centimeters, multiply the number of inches by 2.54. For example, 10 inches × 2.54 = 25.4 centimeters. This conversion factor is exact by definition – one inch is defined as exactly 2.54 centimeters. To convert centimeters to inches, divide by 2.54. This conversion is commonly needed for screen sizes, clothing measurements, and when working with tools or materials from different countries.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left">Why do different countries use different measurement systems?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  The metric system was developed in France in the late 1700s and gradually adopted by most countries due to its logical, decimal-based structure. The imperial system evolved from earlier English units and was used throughout the British Empire. While most countries switched to metric in the 20th century, the United States retained imperial units for most purposes due to the high cost of conversion and established infrastructure. Today, even the US uses metric in science, medicine, and military applications, though imperial units remain common in everyday life.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LengthConverterPage;