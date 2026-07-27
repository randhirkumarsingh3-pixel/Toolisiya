import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, ArrowRight, Wrench } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useActiveTools } from '@/contexts/ActiveToolsContext.jsx';
import pb from '@/lib/pocketbaseClient.js';

const SearchBar = ({ className = '' }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const { activeTools } = useActiveTools();

  // Filter active tools locally
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return activeTools.filter(tool => 
      tool.name?.toLowerCase().includes(lowerQuery) || 
      (tool.description && tool.description.toLowerCase().includes(lowerQuery)) ||
      tool.category?.toLowerCase().includes(lowerQuery)
    ).slice(0, 10);
  }, [query, activeTools]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (tool) => {
    setIsOpen(false);
    setQuery('');
    
    // Fix incorrect URL patterns from DB (e.g., /tools/tool-name -> /category/tool-name)
    let targetUrl = tool.url;
    if (targetUrl.startsWith('/tools/')) {
      const slug = targetUrl.replace('/tools/', '');
      const categorySlug = tool.category.toLowerCase().replace(/\s+/g, '-');
      targetUrl = `/${categorySlug}/${slug}`;
    }
    
    navigate(targetUrl);
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() ? 
        <span key={i} className="search-highlight">{part}</span> : part
    );
  };

  return (
    <div ref={wrapperRef} className={`relative w-full max-w-[600px] mx-auto ${className}`}>
      <div className="relative group">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${isOpen && query ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
        <Input
          type="text"
          placeholder="Search for tools, calculators, generators..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            if (query.trim().length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-12 py-4 text-base h-14 rounded-xl border-2 border-muted hover:border-primary/30 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 shadow-sm transition-all bg-background"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="search-dropdown"
          aria-activedescendant={selectedIndex >= 0 ? `search-item-${selectedIndex}` : undefined}
        />
      </div>

      {isOpen && query.trim().length > 0 && (
        <div 
          id="search-dropdown"
          className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2"
          role="listbox"
        >
          {results.length > 0 ? (
            <ul className="max-h-[300px] overflow-y-auto custom-scrollbar py-2">
              {results.map((tool, index) => (
                <li
                  key={tool.id}
                  id={`search-item-${index}`}
                  role="option"
                  aria-selected={selectedIndex === index}
                  onClick={() => handleSelect(tool)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className="search-dropdown-item"
                >
                  <div className="bg-muted w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-muted-foreground">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground truncate">
                      {highlightText(tool.name, query)}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {tool.category} • {highlightText(tool.description, query)}
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 transition-opacity ${selectedIndex === index ? 'opacity-100 text-primary' : 'opacity-0'}`} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              <p>No tools found matching "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;