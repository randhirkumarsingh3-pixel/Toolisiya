import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

const FormulaDisplay = ({ formula, description, block = true }) => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const renderFormula = async () => {
      try {
        setLoading(true);
        const katex = (await import('katex')).default;
        if (isMounted && containerRef.current) {
          katex.render(formula, containerRef.current, {
            displayMode: block,
            throwOnError: false,
            errorColor: '#ef4444'
          });
          setError(null);
        }
      } catch (err) {
        console.error('KaTeX error:', err);
        if (isMounted) setError('Failed to render formula');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (formula) {
      renderFormula();
    }

    return () => { isMounted = false; };
  }, [formula, block]);

  return (
    <div className="my-4 p-4 bg-muted/50 rounded-lg border border-border flex flex-col items-center justify-center overflow-x-auto">
      {description && <p className="text-sm text-muted-foreground mb-2">{description}</p>}
      {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
      <div ref={containerRef} className={`text-lg ${loading ? 'hidden' : 'block'}`} />
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
};

export default FormulaDisplay;