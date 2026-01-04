import React from 'react';
import { X, MessageSquare, FileText } from 'lucide-react';
import { LocationReasonAnswer } from '@/types';

interface LocationReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: string;
  reason: LocationReasonAnswer | string;
}

export default function LocationReasonModal({
  isOpen,
  onClose,
  person,
  reason
}: LocationReasonModalProps) {
  if (!isOpen) return null;

  const reasonText = typeof reason === 'string' ? reason : reason.reason;
  const probability = typeof reason !== 'string' ? reason.probability : undefined;
  const sources = typeof reason !== 'string' ? reason.source : undefined;

  // Filter sources to show details for relevant types
  const relevantSources = sources?.filter(s => 
    s.sourceType !== 'Daily Location' && 
    s.sourceType !== 'Core Knowledge Base'
  );

  return (
    <div 
      className="fixed inset-0 z-[10000] bg-navy/20 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-card-bg w-full max-w-sm md:max-w-xl rounded-xl shadow-2xl border-2 border-border-beige overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border-beige bg-page-bg/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-brown animate-pulse" />
            <h4 className="text-[10px] font-black text-navy uppercase tracking-[0.2em]">
              Historical Analysis: {person}
            </h4>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-navy/5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-navy" />
          </button>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-accent-brown uppercase tracking-widest opacity-60">
              Determined Context
            </span>
            <p className="text-sm font-serif text-navy leading-relaxed">
              {reasonText}
            </p>
          </div>

          {probability && (
            <div className="pt-4 border-t border-border-beige/50 flex items-center justify-between">
              <span className="text-[9px] font-bold text-muted-gray uppercase tracking-widest">
                Confidence Rating
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-black uppercase tracking-widest ${
                  probability === 'high' ? 'text-accent-green' :
                  probability === 'medium' ? 'text-accent-brown' :
                  'text-muted-gray'
                }`}>
                  {probability}
                </span>
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-1.5 rounded-full ${
                        (probability === 'high') || 
                        (probability === 'medium' && i <= 2) ||
                        (probability === 'low' && i === 1)
                          ? (probability === 'high' ? 'bg-accent-green' : 'bg-accent-brown')
                          : 'bg-muted-gray/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {relevantSources && relevantSources.length > 0 && (
             <div className="pt-4 border-t border-border-beige/50 space-y-3">
               <span className="text-[9px] font-bold text-muted-gray uppercase tracking-widest flex items-center gap-2">
                 <FileText className="w-3 h-3" />
                 Primary Sources
               </span>
               <div className="space-y-2">
                 {relevantSources.map((source, idx) => (
                   <div key={idx} className="bg-section-bg/50 p-2 rounded-sm border border-border-beige/50">
                     <div className="flex items-baseline justify-between mb-1">
                       <span className="text-[9px] font-bold text-navy uppercase tracking-wider opacity-70">
                         {source.sourceType}
                       </span>
                     </div>
                     <p className="text-[10px] text-slate font-serif leading-relaxed">
                       {source.sourceDetail}
                     </p>
                   </div>
                 ))}
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
