'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchResult {
  _id: string;
  date: string;
  author: string;
  recipient: string;
  full_text: string;
  snippet: string;
  source_type: string;
}

interface SearchResponse {
  resolved_name: string | null;
  query: string;
  count: number;
  documents: SearchResult[];
}

interface Suggestion {
  alias: string;
  canonical: string;
}

export default function SocialGraphPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`/api/social-graph/autocomplete?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
        setActiveIndex(-1); // Reset selection on new suggestions
      } catch (error) {
        console.error("Autocomplete error:", error);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setResults(null);
    setShowSuggestions(false);

    try {
      const res = await fetch(`/api/social-graph/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    const targetName = suggestion.canonical; // Use canonical name
    setQuery(targetName);
    handleSearch(targetName);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) {
        handleSelectSuggestion(suggestions[activeIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-stone-800">Social Graph Search</h1>
      <p className="text-stone-600 mb-8">
        Enter a name (e.g., "Churchill", "WSC", "Violet") to find all mentions in the correspondence and diaries.
      </p>

      <div className="flex gap-4 max-w-lg mb-10 relative" ref={wrapperRef}>
        <div className="flex-1 relative">
            <Input 
            type="text" 
            placeholder="Search name..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            className="w-full"
            onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
            autoComplete="off"
            />
            
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-stone-200 rounded-md shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                    {suggestions.map((s, i) => (
                        <div 
                            key={i} 
                            className={`px-4 py-2 cursor-pointer text-sm flex justify-between ${i === activeIndex ? 'bg-stone-100' : 'hover:bg-stone-50'}`}
                            onClick={() => handleSelectSuggestion(s)}
                        >
                            <span className="font-medium text-stone-800">{s.alias}</span>
                            <span className="text-stone-500 italic ml-2 text-xs">{s.canonical}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <Button onClick={() => handleSearch()} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {results && (
        <div className="space-y-6">
          <div className="bg-stone-100 p-4 rounded-lg mb-6">
            <p className="text-lg">
              Found <strong>{results.count}</strong> documents for 
              {results.resolved_name ? (
                <> "<strong>{results.resolved_name}</strong>" (resolved from "{results.query}")</>
              ) : (
                <> "{results.query}"</>
              )}
            </p>
          </div>

          <div className="grid gap-6">
            {results.documents.map((doc) => (
              <div key={doc._id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-stone-900">
                      {doc.author} → {doc.recipient || 'Diary'}
                    </h3>
                    <p className="text-sm text-stone-500">
                      {new Date(doc.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <span className="text-xs uppercase bg-stone-200 px-2 py-1 rounded text-stone-600">
                    {doc.source_type}
                  </span>
                </div>
                {doc.snippet ? (
                    <div 
                        className="text-stone-700 text-sm leading-relaxed border-t pt-2 mt-2 font-serif"
                        dangerouslySetInnerHTML={{ __html: doc.snippet }} 
                    />
                ) : (
                    <p className="text-stone-700 text-sm leading-relaxed border-t pt-2 mt-2">
                        {doc.full_text}
                    </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
