import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const tipsData = {
  "GST Calculator": [
    <><strong>Formula:</strong> GST Amount = (Base Amount × GST Rate) / 100.</>,
    <><strong>Indian GST Rates:</strong> Standard slabs are currently 5%, 12%, 18%, and 28% depending on the goods or services.</>,
    <><strong>Total Price Calculation:</strong> Simply add the calculated GST amount to your original base amount.</>,
    <><strong>Inclusive vs Exclusive:</strong> If a price is 'GST Inclusive', the tax is already built into the final price. Our tool calculates 'Exclusive' GST by default.</>,
    <><strong>Related Tool:</strong> Looking to plan your loans? Try our <Link to="/finance/emi-calculator" className="text-primary hover:underline font-medium">EMI Calculator</Link>.</>
  ],
  "EMI Calculator": [
    <><strong>Formula:</strong> EMI = [P × R × (1+R)^N] / [(1+R)^N - 1] (P = Principal, R = Monthly Rate, N = Months).</>,
    <><strong>Monthly Interest Rate:</strong> Remember to divide your annual interest rate by 12 to get the monthly rate used in the calculation.</>,
    <><strong>Total Amount Payable:</strong> This includes your original borrowed principal plus the total interest accumulated over the entire tenure.</>,
    <><strong>Related Tool:</strong> Grow your wealth systematically using our <Link to="/finance/sip-calculator" className="text-primary hover:underline font-medium">SIP Calculator</Link>.</>
  ],
  "Resume Builder": [
    <><strong>Ideal Length:</strong> Keep your resume to 1 page if you have less than 10 years of experience; 2 pages max for senior professionals.</>,
    <><strong>Action Verbs:</strong> Start bullet points with strong action verbs like 'Spearheaded', 'Optimized', 'Developed', or 'Managed'.</>,
    <><strong>Quantifiable Results:</strong> Use numbers, percentages, and dollar amounts to demonstrate the impact of your work.</>,
    <><strong>Related Tool:</strong> Create a compelling introduction with our <Link to="/career/cover-letter-generator" className="text-primary hover:underline font-medium">Cover Letter Generator</Link>.</>
  ],
  "Currency Converter": [
    <><strong>Exchange Rate Changes:</strong> Forex markets are highly volatile, and rates fluctuate constantly throughout the trading day.</>,
    <><strong>Current Rates:</strong> The rates shown are 'mid-market' rates. This is the true global rate before bank markups.</>,
    <><strong>Bank Fees:</strong> When actually transferring money, your bank or service provider will likely apply a margin or conversion fee.</>,
    <><strong>Related Tool:</strong> Check out the <Link to="/finance/percentage-calculator" className="text-primary hover:underline font-medium">Percentage Calculator</Link> to calculate conversion margins.</>
  ],
  "Image Compressor": [
    <><strong>Compression Benefits:</strong> Smaller image sizes lead to significantly faster website loading times and reduced bandwidth usage.</>,
    <><strong>Lossy vs Lossless:</strong> Lossy compression permanently removes some data to shrink size, while lossless retains original quality.</>,
    <><strong>SEO Benefits:</strong> Search engines like Google prioritize fast-loading pages, making compressed images vital for SEO.</>,
    <><strong>Related Tool:</strong> Need a different format? Use our <Link to="/converters/image-converter" className="text-primary hover:underline font-medium">Image Converter</Link>.</>
  ],
  "JSON Formatter": [
    <><strong>JSON Definition:</strong> JavaScript Object Notation (JSON) is a lightweight data-interchange format that is easy to read and write.</>,
    <><strong>Syntax Requirements:</strong> All JSON keys must be enclosed in double quotes, and trailing commas are strictly forbidden.</>,
    <><strong>Validation:</strong> Our tool instantly validates your JSON syntax and highlights exactly where errors or typos exist.</>,
    <><strong>Related Tool:</strong> Encode sensitive data safely with our <Link to="/converters/base64-encoder-decoder" className="text-primary hover:underline font-medium">Base64 Encoder</Link>.</>
  ],
  "Default": [
    <><strong>Accuracy:</strong> Always double-check your inputs before relying on the final calculation or output.</>,
    <><strong>Privacy:</strong> This tool processes your data securely. Many operations happen entirely locally within your browser.</>,
    <><strong>Bookmarks:</strong> Bookmark this page (Ctrl+D / Cmd+D) to access this utility instantly whenever you need it.</>,
    <><strong>Mobile Friendly:</strong> You can use this tool seamlessly on your smartphone or tablet on the go.</>
  ]
};

const ExtraToolTips = ({ toolName }) => {
  const tips = tipsData[toolName] || tipsData["Default"];

  return (
    <Card className="bg-primary/5 border-primary/20 mt-8 shadow-sm">
      <CardHeader className="pb-3 border-b border-primary/10">
        <CardTitle className="text-xl flex items-center gap-2 text-foreground">
          <Lightbulb className="h-6 w-6 text-primary" />
          Extra Tips & Information
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <ul className="space-y-4">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary/70 shrink-0 mt-0.5" />
              <p className="text-sm text-foreground/90 leading-relaxed">
                {tip}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ExtraToolTips;