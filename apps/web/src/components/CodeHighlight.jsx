import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CodeHighlight = ({ code, language = 'javascript' }) => {
  const codeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const highlightCode = async () => {
      try {
        setLoading(true);
        const hljs = (await import('highlight.js')).default;
        if (isMounted && codeRef.current) {
          delete codeRef.current.dataset.highlighted;
          hljs.highlightElement(codeRef.current);
        }
      } catch (err) {
        console.error('Highlight.js error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (code) {
      highlightCode();
    }

    return () => { isMounted = false; };
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg overflow-hidden border border-border bg-[#0d1117]">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/10 border-b border-border/10">
        <span className="text-xs font-mono text-muted-foreground">{language}</span>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={handleCopy}>
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <div className="p-4 overflow-x-auto text-sm font-mono">
        {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mb-2" />}
        <pre className="m-0">
          <code ref={codeRef} className={`language-${language} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeHighlight;