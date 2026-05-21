import React, { useState, useEffect, useCallback, useRef } from 'react';
import { evaluate } from 'mathjs';
import { Copy, Check, Delete, RotateCcw, Calculator, Beaker } from 'lucide-react';
import { toast } from 'sonner';
import SEOHead from '@/components/SEOHead.jsx';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import StickyNavigation from '@/components/StickyNavigation.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ToolContentDisplay from '@/components/ToolContentDisplay.jsx';

const scientificContentData = {
  title: "Complete Guide to Scientific Calculators & Advanced Mathematics",
  introduction: "An Advanced Scientific Calculator is a specialized digital tool designed to solve complex mathematical, scientific, and engineering calculations. Beyond simple arithmetic, it allows students, engineers, and researchers to compute trigonometric functions, logarithms, exponents, and multi-step algebraic expressions efficiently.",
  howToUse: [
    {
      title: "Select Operation Mode",
      description: "Toggle between 'Basic Mode' for standard calculations and 'Scientific Mode' to unlock advanced features like trigonometry and logarithms."
    },
    {
      title: "Input Expression",
      description: "Click the buttons or use your keyboard to enter your mathematical equation. The display will show your full expression."
    },
    {
      title: "Compute & Review Result",
      description: "Review the computed value in real-time or press '=' to confirm and copy your final answer."
    },
    {
      title: "Use Constants & Functions",
      description: "Apply functions like sine (sin), cosine (cos), tangents (tan), natural log (ln), common log (log), or the mathematical constant Pi (π)."
    }
  ],
  realWorldExamples: [
    {
      title: "Scenario A: Trigonometry for Construction & Navigation",
      scenario: "Finding the height of a building where the angle of elevation is 35 degrees and the distance from the base is 50 meters (using: 50 * tan(35 * pi / 180)).",
      outcome: "The calculator outputs 35.01 meters, providing accurate measurements based on standard trigonometric ratios."
    },
    {
      title: "Scenario B: Decibel Level Logarithmic Calculation",
      scenario: "Calculating signal gain or sound intensity levels using logarithmic functions (e.g., log10(100) * 10).",
      outcome: "The result resolves to 20 decibels, showing how logarithmic scales represent exponential increases."
    }
  ],
  tipsAndTricks: [
    {
      title: "Ensure Correct Angle Units",
      description: "Trigonometric functions like sin, cos, and tan evaluate arguments in Radians. When calculating in Degrees, convert them by multiplying by (π / 180)."
    },
    {
      title: "Use Parentheses for Complex Denominators",
      description: "When dividing by an expression involving addition or multiplication, wrap the entire denominator in parentheses (e.g., 10 / (2 * 5)) to avoid PEMDAS order errors."
    },
    {
      title: "Keyboard Shortcuts Speed Up Input",
      description: "You can type math expressions directly on your physical keyboard. Use '*' for multiplication, '/' for division, 'Enter' for equals, and 'Backspace' to correct errors."
    }
  ],
  commonMistakes: [
    {
      title: "Mismatched Parentheses",
      description: "Forgetting to close a opened parenthesis (e.g., 'sin(pi / 2') will result in syntax errors and calculation failure.",
      prevention: "Always ensure every opening parenthesis '(' has a corresponding closing parenthesis ')'."
    },
    {
      title: "Confusing LN and LOG",
      description: "Using 'log' when you need natural logarithm (base e), or 'ln' when you need common logarithm (base 10).",
      prevention: "Remember that 'ln' is base e (2.718...) and 'log' is base 10."
    }
  ],
  faqs: [
    {
      question: "What is the difference between basic and scientific calculators?",
      answer: "A basic calculator only performs simple arithmetic (+, -, *, /). A scientific calculator supports advanced math like trigonometry, logarithms, power exponents, roots, parentheses, and physical constants."
    },
    {
      question: "Why are my trigonometric results incorrect?",
      answer: "This is usually because the calculator expects angles in Radians, but you are entering them in Degrees. To use degrees, convert the angle: degrees * (π / 180)."
    },
    {
      question: "What is the order of operations?",
      answer: "This calculator follows standard BODMAS/PEMDAS rules: Parentheses first, then Exponents/Roots, then Multiplication and Division (left-to-right), and finally Addition and Subtraction (left-to-right)."
    }
  ],
  relatedTools: [
    { title: "Investment Calculator", url: "/finance/investment-calculator" },
    { title: "Loan Calculator", url: "/finance/loan-calculator" },
    { title: "FD Calculator", url: "/finance/fd-calculator" }
  ]
};

const AdvancedScientificCalculatorPage = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [isScientific, setIsScientific] = useState(false);
  const [copied, setCopied] = useState(false);
  const displayRef = useRef(null);

  const calculateResult = useCallback((expr) => {
    if (!expr) {
      setResult('');
      return;
    }
    try {
      const mathExpr = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'pi')
        .replace(/√\(/g, 'sqrt(')
        .replace(/sin\(/g, 'sin(')
        .replace(/cos\(/g, 'cos(')
        .replace(/tan\(/g, 'tan(')
        .replace(/log\(/g, 'log10(')
        .replace(/ln\(/g, 'log(');
        
      const res = evaluate(mathExpr);
      const formatted = Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(10)).toString();
      setResult(formatted);
    } catch (error) {
      setResult(''); 
    }
  }, []);

  const handleInput = (val) => {
    setExpression(prev => {
      const newExpr = prev + val;
      calculateResult(newExpr);
      return newExpr;
    });
  };

  const handleEquals = () => {
    if (result) {
      setExpression(result);
      setResult('');
    } else if (expression) {
      try {
        const mathExpr = expression
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/π/g, 'pi');
        const res = evaluate(mathExpr);
        const formatted = Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(10)).toString();
        setExpression(formatted);
      } catch (err) {
        toast.error('Invalid expression');
      }
    }
  };

  const handleClear = () => {
    setExpression('');
    setResult('');
  };

  const handleBackspace = () => {
    setExpression(prev => {
      const newExpr = prev.slice(0, -1);
      calculateResult(newExpr);
      return newExpr;
    });
  };

  const handleCopy = () => {
    const textToCopy = result || expression;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      if (/[0-9.]/.test(key)) {
        handleInput(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        const visualKey = key === '*' ? '×' : key === '/' ? '÷' : key;
        handleInput(visualKey);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key === 'Escape') {
        handleClear();
      } else if (['(', ')', '^'].includes(key)) {
        handleInput(key);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, result]);

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = displayRef.current.scrollWidth;
    }
  }, [expression]);

  const basicButtons = [
    '(', ')', 'C', 'AC',
    '7', '8', '9', '÷',
    '4', '5', '6', '×',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  const scientificButtons = [
    'sin(', 'cos(', 'tan(', 'π',
    'log(', 'ln(', '√(', '^',
    '(', ')', 'C', 'AC',
    '7', '8', '9', '÷',
    '4', '5', '6', '×',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  const buttonsToRender = isScientific ? scientificButtons : basicButtons;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead 
        defaultTitle="Advanced Scientific Calculator Online – Solve Complex Math Easily"
        defaultDescription="Perform advanced mathematical calculations including trigonometry, algebra, and logarithms using our scientific calculator."
        keywords="scientific calculator online, advanced scientific calculator, math calculator online, trigonometry calculator, log calculator online, algebra calculator, equation solver calculator, scientific calculator with functions, free scientific calculator, online math solver"
      />
      <main className="flex-1 py-12">
        <StickyNavigation />
        <div className="container mx-auto px-4 max-w-4xl">
          <BreadcrumbNavigation customTitle="Advanced Scientific Calculator" />
          
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 tracking-tight flex items-center justify-center gap-3">
              <Calculator className="h-8 w-8 text-primary" />
              Scientific Calculator for Advanced Calculations
            </h1>
            <p className="text-lg text-muted-foreground">
              Evaluate complex mathematical expressions, trigonometry, logarithms, and standard arithmetic instantly.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-center">
            <Card className="w-full max-w-sm shadow-xl border-border mx-auto md:mx-0 bg-card">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="mode-toggle" 
                      checked={isScientific} 
                      onCheckedChange={setIsScientific} 
                    />
                    <Label htmlFor="mode-toggle" className="cursor-pointer font-medium flex items-center gap-1 text-sm">
                      {isScientific ? <Beaker className="w-4 h-4 text-primary" /> : <Calculator className="w-4 h-4 text-muted-foreground" />}
                      {isScientific ? 'Scientific Mode' : 'Basic Mode'}
                    </Label>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy Result">
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>

                <div className="bg-muted/50 rounded-xl p-4 mb-6 border border-border/50 shadow-inner flex flex-col items-end min-h-[100px]">
                  <div 
                    ref={displayRef}
                    className="w-full text-right text-lg text-muted-foreground overflow-x-auto whitespace-nowrap scrollbar-hide pb-1"
                  >
                    {expression || '0'}
                  </div>
                  <div className="w-full text-right text-4xl font-bold tracking-tight text-foreground truncate mt-auto">
                    {result || (expression ? '' : '0')}
                  </div>
                </div>

                <div className={`grid gap-3 ${isScientific ? 'grid-cols-4' : 'grid-cols-4'}`}>
                  {buttonsToRender.map((btn, index) => {
                    const isOperator = ['÷', '×', '-', '+', '=', '^'].includes(btn);
                    const isAction = ['C', 'AC'].includes(btn);
                    const isFunc = ['sin(', 'cos(', 'tan(', 'log(', 'ln(', '√(', 'π'].includes(btn);
                    
                    return (
                      <Button
                        key={index}
                        variant={isOperator ? 'default' : isAction ? 'destructive' : isFunc ? 'secondary' : 'outline'}
                        className={`h-14 text-lg font-medium shadow-sm active:scale-[0.96] transition-transform ${isOperator ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''} ${isAction ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' : ''}`}
                        onClick={() => {
                          if (btn === 'AC') handleClear();
                          else if (btn === 'C') handleBackspace();
                          else if (btn === '=') handleEquals();
                          else handleInput(btn);
                        }}
                      >
                        {btn === 'C' ? <Delete className="h-5 w-5" /> : btn === 'AC' ? <RotateCcw className="h-5 w-5" /> : btn.replace('(', '')}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="w-full max-w-md space-y-6">
              <Card className="bg-card shadow-sm border-border">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-3">How It Works</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li><strong className="text-foreground">Evaluate as you type:</strong> The calculator attempts to solve your expression in real-time.</li>
                    <li><strong className="text-foreground">BODMAS/PEMDAS:</strong> Operations follow standard mathematical order (Parentheses, Exponents, Multiplication/Division, Addition/Subtraction).</li>
                    <li><strong className="text-foreground">Keyboard Support:</strong> Use your physical keyboard to type numbers and operators. Press Enter for equals, Backspace to delete.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-sm border-border">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-3">Advanced Functions</h3>
                  <p className="text-sm text-muted-foreground mb-4">Toggle <strong>Scientific Mode</strong> to access advanced features:</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-bold text-foreground">sin, cos, tan:</span> Trigonometry (in radians)
                    </div>
                    <div>
                      <span className="font-bold text-foreground">log, ln:</span> Base-10 and Natural logarithm
                    </div>
                    <div>
                      <span className="font-bold text-foreground">√:</span> Square root
                    </div>
                    <div>
                      <span className="font-bold text-foreground">^:</span> Exponentiation (e.g. 2^3)
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <ToolContentDisplay content={scientificContentData} />
        </div>
      </main>
    </div>
  );
};

export default AdvancedScientificCalculatorPage;