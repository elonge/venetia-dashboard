'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { getRealSourceName, sourceNameMapping } from '@/constants';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  markdownText?: string;
  footnotes?: Array<{ sourceId: string; date: string | null }>;
  isStreaming?: boolean;
  status?: string;
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  const replaceSourceNames = (text: string): string => {
    if (!text) return text;
    
    // 1. Regex for dynamic patterns like primary_letter_..., hansard_..., churchill_cabinet_...
    // This catches patterns like "primary_letter_h_h_asquith_venetia_stanley, 1915-01-20"
    let processedText = text.replace(/(?:primary_letter_|hansard_|churchill_cabinet_)[a-zA-Z0-9_\-]+(?:, \d{4}-\d{2}-\d{2})?/g, (match) => {
        return getRealSourceName(match);
    });

    // 2. Direct mappings from sourceNameMapping
    const entries = Object.entries(sourceNameMapping).sort(
      ([a], [b]) => b.length - a.length
    );

    return entries.reduce((acc, [sourceName, displayName]) => {
      if (!sourceName) return acc;
      return acc.split(sourceName).join(displayName);
    }, processedText);
  };

  const markdownComponents = {
    p: ({ node, ...props }: any) => <p className="mb-4 last:mb-0" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
    li: ({ node, ...props }: any) => <li className="pl-1" {...props} />,
    h1: ({ node, ...props }: any) => <h1 className="text-lg font-bold mb-2 mt-4 text-[#1A2A40]" {...props} />,
    h2: ({ node, ...props }: any) => <h2 className="text-base font-bold mb-2 mt-3 text-[#1A2A40]" {...props} />,
    h3: ({ node, ...props }: any) => <h3 className="text-sm font-bold mb-1 mt-2 text-[#1A2A40]" {...props} />,
    a: ({ node, href, children, className, ...props }: any) => {
      // Remove the back-reference link (usually a ↩ symbol or similar)
      if (className === 'data-footnote-backref') {
        return null;
      }

      const isFootnote = href?.startsWith('#user-content-fn-') || href?.startsWith('#fn-');
      if (isFootnote) {
          const idMatch = href.match(/\d+$/);
          const index = idMatch ? parseInt(idMatch[0], 10) : 0;
          const footnote = message.footnotes?.[index - 1];
          if (footnote) {
              const sourceName = getRealSourceName(footnote.sourceId);
              return (
               <span className="relative group inline-flex items-center justify-center cursor-help text-accent-green font-bold no-underline align-baseline" style={{verticalAlign: 'super', fontSize: '0.6em'}}>
                  <span className="text-[10px] md:text-[11px] bg-[#F5F0E8] px-1 rounded-sm border border-[#D4CFC4] hover:bg-accent-green hover:text-white transition-colors">
                    {children}
                  </span>
                  <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[220px] bg-[#F5F0E8] text-[#1A2A40] text-xs p-2.5 rounded shadow-xl border border-[#8B4513] z-50 pointer-events-none text-center leading-relaxed whitespace-normal animate-in fade-in slide-in-from-bottom-1 duration-200">
                    {sourceName}
                    {footnote.date && <span className="block text-[10px] text-[#5A6472] mt-0.5 italic">{footnote.date}</span>}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#8B4513]" />
                  </span>
               </span>
              );
          }
      }
      return (
         <a 
           className="text-[#8B4513] font-medium underline underline-offset-2 hover:text-accent-green transition-colors" 
           target="_blank" 
           rel="noopener noreferrer" 
           href={href}
           {...props} 
         >
           {children}
         </a>
      );
    },
    blockquote: ({ node, ...props }: any) => (
      <blockquote className="border-l-2 border-accent-green pl-4 italic my-4 text-muted-gray bg-[#F9F9F9] py-2 pr-2 rounded-r-sm" {...props} />
    ),
    code: ({ node, inline, ...props }: any) => 
      inline 
        ? <code className="bg-[#F5F0E8] px-1 py-0.5 rounded text-xs font-mono text-[#8B4513]" {...props} />
        : <pre className="bg-[#F5F0E8] p-3 rounded-sm overflow-x-auto text-xs font-mono text-[#1A2A40] mb-4 border border-border-beige"><code {...props} /></pre>,
    table: ({ node, ...props }: any) => (
      <div className="overflow-x-auto mb-4 border border-border-beige rounded-sm">
        <table className="w-full text-sm text-left" {...props} />
      </div>
    ),
    thead: ({ node, ...props }: any) => <thead className="bg-[#F5F0E8] text-[#1A2A40] font-bold uppercase text-xs tracking-wider" {...props} />,
    tbody: ({ node, ...props }: any) => <tbody className="divide-y divide-border-beige" {...props} />,
    tr: ({ node, ...props }: any) => <tr className="hover:bg-gray-50/50 transition-colors" {...props} />,
    th: ({ node, ...props }: any) => <th className="px-4 py-2" {...props} />,
    td: ({ node, ...props }: any) => <td className="px-4 py-2" {...props} />,
    sup: ({ node, children, ...props }: any) => (
       <span {...props}>{children}</span> 
    ),
    section: ({ node, className, ...props }: any) => {
        if (props['data-footnotes']) {
            return (
                <section className="mt-6 pt-4 border-t border-border-beige text-xs text-muted-gray font-sans" {...props} />
            );
        }
        return <section className={className} {...props} />;
    },
  };
  
  // 1. USER MESSAGE: Solid Navy, Modern, Direct
  if (isUser) {
    return (
      <div className="flex justify-end mb-4 md:mb-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
        <div className="bg-[#1A2A40] text-[#F5F0E8] px-4 md:px-5 py-3 md:py-3.5 rounded-sm rounded-br-sm max-w-[90%] md:max-w-[85%] shadow-md text-xs md:text-sm leading-relaxed font-medium tracking-wide">
          {replaceSourceNames(message.content)}
        </div>
      </div>
    );
  }

  // 2. AI MESSAGE: "Archival Briefing Note" Style
  const hasMarkdownText = !!message.markdownText;

  // Consolidate unique sources for display
  const getUniqueSources = () => {
    const uniqueMap = new Map();
    
    // Add Footnotes (New Schema)
    if (message.footnotes && message.footnotes.length > 0) {
      message.footnotes.forEach(f => {
        const displayName = getRealSourceName(f.sourceId);
         if (!uniqueMap.has(displayName)) {
             uniqueMap.set(displayName, { type: 'link', value: f.sourceId }); 
         }
      });
    }
    
    return Array.from(uniqueMap.values());
  };

  const consolidatedSources = getUniqueSources();

  // Prepare content with footnotes appended if necessary
  let renderedContent = null;
  if (message.isStreaming && !message.content && !message.markdownText) {
    renderedContent = (
      <div className="py-2 animate-in fade-in duration-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative shrink-0">
            <div className="w-5 h-5 border-2 border-accent-green/20 border-t-accent-green rounded-full animate-spin" />
            <div className="absolute inset-0 bg-accent-green/5 rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-green animate-pulse">
              {message.status || "Archival Search in Progress"}
            </span>
          </div>
        </div>
        
        <div className="space-y-3 opacity-40">
          <div className="h-2 bg-[#F5F0E8] rounded-full w-[95%] animate-pulse" />
          <div className="h-2 bg-[#F5F0E8] rounded-full w-[80%] animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="h-2 bg-[#F5F0E8] rounded-full w-[85%] animate-pulse" style={{ animationDelay: '300ms' }} />
          <div className="h-2 bg-[#F5F0E8] rounded-full w-[60%] animate-pulse" style={{ animationDelay: '450ms' }} />
        </div>
      </div>
    );
  } else if (hasMarkdownText) {
     const hasExistingFootnotes = message.markdownText!.includes('### Footnotes') || message.markdownText!.includes('## Footnotes');
     console.log('message.footnotes = :', message.footnotes);
     const footnotesBlock = !hasExistingFootnotes && message.footnotes && message.footnotes.length > 0
        ? '\n\n' + message.footnotes.map((f, i) => `[^${i + 1}]: ${getRealSourceName(f.sourceId)} ${f.date ? f.date : ''}`).join('\n')
        : '';
     
     const contentWithFootnotes = replaceSourceNames(message.markdownText!) + footnotesBlock;
     console.log('hasExistingFootnotes:', hasExistingFootnotes);
     console.log('footnotesBlock:', footnotesBlock);
     renderedContent = (
        <div className="markdown-container">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {contentWithFootnotes}
            </ReactMarkdown>
        </div>
     );
  } else {
     renderedContent = (
        <div className="markdown-container">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {replaceSourceNames(message.content || (message.isStreaming ? (message.status || "Retrieving document data...") : ""))}
            </ReactMarkdown>
            {message.isStreaming && (
                <div className="mt-2">
                    <span className="inline-block w-1.5 h-4 bg-accent-green animate-pulse align-middle" />
                </div>
            )}
        </div>
     );
  }

  return (
    <div className="flex justify-start mb-6 md:mb-8 w-full animate-in slide-in-from-bottom-2 fade-in duration-500 rounded-sm">
      <div className="max-w-[95%] w-full">
        
        {/* A. The "Persona" Header */}
        <div className="flex items-center gap-1.5 md:gap-2 mb-2 ml-1">
          <div className="w-3.5 h-3.5 md:w-4 md:h-4 bg-accent-green rounded-full flex items-center justify-center shadow-sm shrink-0">
             <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full" />
          </div>
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-accent-green">
            Archival Analysis
          </span>
        </div>

        {/* B. The "Document" Container */}
        <div className="bg-white border border-border-beige p-4 md:p-6 rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative">
          
          {/* C. Content Area */}
          <div className="font-serif text-[#1A2A40] leading-6 md:leading-7 text-sm md:text-[15px]">
             {renderedContent}
          </div>

          {/* D. Footer: Sources & Citations */}
          {/* {consolidatedSources.length > 0 && (
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-dashed border-border-beige flex flex-col gap-2">
              <span className="text-[8px] md:text-[9px] font-bold text-muted-gray uppercase tracking-widest mb-1">
                Verified Sources
              </span>
              
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {consolidatedSources.map((source, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-1 md:gap-1.5 text-[9px] md:text-[10px] text-[#8B4513] font-bold uppercase tracking-wider bg-page-bg border border-border-beige px-2 md:px-2.5 py-1 md:py-1.5 rounded-sm hover:bg-[#E8E4D9] transition-colors cursor-help"
                    title={source.value}
                  >
                    <ExternalLink size={9} className="md:w-[10px] md:h-[10px] text-accent-green shrink-0" />
                    <span className="truncate max-w-[120px] md:max-w-none">{getRealSourceName(source.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
