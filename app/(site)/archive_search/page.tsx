"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileQuestion } from "lucide-react";

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
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  documents: SearchResult[];
}

interface Suggestion {
  alias: string;
  canonical: string;
}

const PAGE_SIZE = 20;

export default function SocialGraphPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState("1912-01-01");
  const [dateTo, setDateTo] = useState("1916-12-31");
  const [author, setAuthor] = useState("");
  const [recipient, setRecipient] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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
        const res = await fetch(
          `/api/social-graph/autocomplete?q=${encodeURIComponent(query)}`
        );
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
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSearch = async ({
    searchQuery = query,
    page = 1,
  }: { searchQuery?: string; page?: number } = {}) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;
    setLoading(true);
    setShowSuggestions(false);
    if (page === 1) {
      setResults(null);
    }

    try {
      const params = new URLSearchParams();
      params.set("q", trimmedQuery);
      params.set("page", page.toString());
      params.set("page_size", PAGE_SIZE.toString());
      if (showFilters) {
        if (author.trim()) params.set("author", author.trim());
        if (recipient.trim()) params.set("recipient", recipient.trim());
        if (dateFrom) params.set("from", dateFrom);
        if (dateTo) params.set("to", dateTo);
      }

      const res = await fetch(`/api/social-graph/search?${params.toString()}`);
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
    handleSearch({ searchQuery: targetName, page: 1 });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch({ page: 1 });
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        handleSelectSuggestion(suggestions[activeIndex]);
      } else {
        handleSearch({ page: 1 });
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const onFilterKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch({ page: 1 });
    }
  };

  const handlePageChange = (nextPage: number) => {
    if (!results || nextPage < 1 || nextPage === results.page) return;
    handleSearch({ page: nextPage });
  };

  const totalCount = results?.total_count ?? results?.count ?? 0;
  const pageSize = results?.page_size ?? PAGE_SIZE;
  const currentPage = results?.page ?? 1;
  const totalPages = results?.total_pages ?? 1;
  const startIndex = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex =
    totalCount === 0 ? 0 : Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto text-center mb-12">
        {!results && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-stone-800">
              Trace a Person Across the Archive
            </h1>
            <p className="text-stone-600 mb-8 text-lg">
              Search letters and diaries from 1912–1916, across names, titles, and
              aliases
            </p>
          </>
        )}

        <div className="space-y-4 text-left">
          <div className="flex flex-wrap gap-3 items-start justify-center">
            <div className="flex-1 relative min-w-[280px]" ref={wrapperRef}>
              <Input
                type="text"
                placeholder="Enter a name, title, or alias (e.g. Churchill, Winston, WSC)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                className="w-full h-11"
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                autoComplete="off"
              />

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-stone-200 rounded-md shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      className={`px-4 py-2 cursor-pointer text-sm flex justify-between ${
                        i === activeIndex ? "bg-stone-100" : "hover:bg-stone-50"
                      }`}
                      onClick={() => handleSelectSuggestion(s)}
                    >
                      <span className="font-medium text-stone-800">
                        {s.alias}
                      </span>
                      <span className="text-stone-500 italic ml-2 text-xs">
                        {s.canonical}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={() => handleSearch({ page: 1 })}
              disabled={loading}
              className="h-11 px-8 text-white bg-stone-800 hover:bg-stone-700"
            >
              {loading ? "Searching..." : "Search"}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="h-11"
            >
              {showFilters ? "Hide filters" : "Refine"}
            </Button>
          </div>

          {showFilters && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 bg-stone-50 border border-stone-200 rounded-lg p-4 mt-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-600">
                  From
                </label>
                <Input
                  type="date"
                  value={dateFrom}
                  max={dateTo}
                  onChange={(e) => setDateFrom(e.target.value)}
                  onKeyDown={onFilterKeyDown}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-600">To</label>
                <Input
                  type="date"
                  value={dateTo}
                  min={dateFrom}
                  onChange={(e) => setDateTo(e.target.value)}
                  onKeyDown={onFilterKeyDown}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-600">
                  Author
                </label>
                <Input
                  type="text"
                  placeholder="Author name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  onKeyDown={onFilterKeyDown}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-600">
                  Recipient
                </label>
                <Input
                  type="text"
                  placeholder="Recipient name"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  onKeyDown={onFilterKeyDown}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {!results && !loading && (
        <div className="flex flex-col items-center justify-center pb-20 text-stone-400">
          <Search className="w-14 h-14 mb-4 opacity-15" />

          <p className="text-lg font-medium text-stone-600 mb-2">
            Begin with a person
          </p>

          <p className="text-sm mb-6 max-w-xl text-center text-stone-500">
            Enter a name to trace every mention across letters and diaries —
            even when the person appears under different titles or spellings.
          </p>

          <div className="text-sm flex flex-wrap justify-center gap-2 text-stone-500">
            <span className="italic">Try:</span>

            {[
              "H. H. Asquith",
              "Venetia Stanley",
              "Edward Grey",
              "Edwin Montagu",
            ].map((name, i, arr) => (
              <span key={name}>
                <button
                  onClick={() => {
                    setQuery(name);
                    handleSearch({ searchQuery: name, page: 1 });
                  }}
                  className="text-stone-700 hover:text-stone-900 font-medium underline decoration-stone-300 hover:decoration-stone-600 transition-all cursor-pointer"
                >
                  {name}
                </button>
                {i < arr.length - 1 && (
                  <span className="text-stone-300 mx-2">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {results && results.count === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <FileQuestion className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-lg font-medium text-stone-500">No results found</p>
          <p className="text-sm">
            We couldn't find any documents matching "{results.query}".
            <br />
            Try checking the spelling or using a different alias.
          </p>
        </div>
      )}

      {results && results.count > 0 && (
        <div className="space-y-6">
          <div className="bg-stone-100 p-4 rounded-lg mb-6">
            <p className="text-lg">
              Found <strong>{totalCount}</strong> documents for
              {results.resolved_name ? (
                <>
                  {" "}
                  "<strong>{results.resolved_name}</strong>" (resolved from "
                  {results.query}")
                </>
              ) : (
                <> "{results.query}"</>
              )}
            </p>
            <p className="text-sm text-stone-600 mt-1">
              Showing {startIndex}-{endIndex}
            </p>
          </div>

          <div className="grid gap-6">
            {results.documents.map((doc) => (
              <div
                key={doc._id}
                className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-stone-900">
                      {doc.author} → {doc.recipient || "Diary"}
                    </h3>
                    <p className="text-sm text-stone-500">
                      {new Date(doc.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
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

          <div className="flex flex-col gap-3 border-t border-stone-200 pt-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-stone-600">
              Showing {startIndex}-{endIndex} of {totalCount}
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={loading || currentPage <= 1}
              >
                Previous
              </Button>
              <span className="text-sm text-stone-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={loading || currentPage >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
