import { format } from 'date-fns';
import { TimelineDayDocument } from '@/types';

interface Props {
  data: TimelineDayDocument;
}

export default function TimelineDay({ data }: Props) {
  const { date, prime_minister, venetia, context, diaries } = data;
  
  const getScoreColor = (score: number) => {
    if (score >= 4) return 'bg-red-100 text-red-800 border-red-200';
    if (score >= 2) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  return (
    <div className="border-l-4 border-slate-300 pl-6 py-4 mb-8 relative">
      <div className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-slate-400 border-2 border-white"></div>
      
      <h2 className="text-2xl font-serif text-slate-800 mb-4">
        {format(new Date(date), 'EEEE, MMMM do, yyyy')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* COLUMN 1: The Prime Minister */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">The Prime Minister</h3>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {prime_minister.metrics?.sharing_score !== undefined && (
              <span className={`text-xs px-2 py-1 rounded border font-medium ${getScoreColor(prime_minister.metrics.sharing_score)}`}>
                Security Breach: {prime_minister.metrics.sharing_score}/5
              </span>
            )}
            {prime_minister.metrics?.emotional_score !== undefined && (
              <span className={`text-xs px-2 py-1 rounded border font-medium ${getScoreColor(prime_minister.metrics.emotional_score)}`}>
                Emotion: {prime_minister.metrics.emotional_score}/5
              </span>
            )}
          </div>

          <div className="text-sm text-slate-600 mb-2">
            📍 {prime_minister.location || "Unknown"}
            {prime_minister.meeting_with_venetia && (
              <span className="block mt-1 text-emerald-600 font-semibold">
                ♥ Met Venetia: {prime_minister.meeting_details}
              </span>
            )}
          </div>

          {prime_minister.letters?.map((letter, idx) => (
            <div key={idx} className="mb-3 text-slate-700 italic border-l-2 border-blue-200 pl-2 text-sm">
              "{letter.summary}"
            </div>
          ))}
        </div>

        {/* COLUMN 2: Context */}
        <div className="space-y-4">
          {context?.secret_churchill && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Secret (Churchill Docs)</h3>
              <p className="text-sm text-slate-800 font-medium">{context.secret_churchill}</p>
            </div>
          )}

          {context?.public_hansard && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Public (Hansard)</h3>
              <p className="text-sm text-slate-600">{context.public_hansard}</p>
            </div>
          )}
        </div>

        {/* COLUMN 3: Venetia & Diaries */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Venetia & Diaries</h3>
          
          {venetia?.location && (
             <div className="text-sm text-slate-600 mb-2">📍 {venetia.location}</div>
          )}

          {/* Venetia's Letters to Edwin */}
          {venetia?.letters_to_edwin?.map((letter, idx) => (
            <div key={idx} className="mb-4">
              <span className="text-xs font-bold text-purple-500 block mb-1">Letter to Edwin:</span>
              <div className="text-sm text-slate-700 bg-purple-50 p-2 rounded border border-purple-100">
                <p className="italic mb-2">"{letter.summary}"</p>
                
                {letter.mood && (
                   <span className="inline-block px-1.5 py-0.5 bg-white text-purple-600 text-xs rounded border border-purple-200 mr-2">
                     Mood: {letter.mood}
                   </span>
                )}
                
                {letter.feelings_about_pm && (
                   <div className="mt-2 pt-2 border-t border-purple-200 text-xs text-purple-800">
                     <strong>On PM:</strong> "{letter.feelings_about_pm}"
                   </div>
                )}
              </div>
            </div>
          ))}

          {/* Diaries */}
          {diaries?.map((entry, idx) => (
            <div key={idx} className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2">
              <span className="font-bold text-slate-700">{entry.author}:</span> {entry.entry}
              {entry.pm_mood_observation && (
                <span className="block text-emerald-600 mt-1 font-medium bg-emerald-50 p-1 rounded">
                  Observed PM Mood: "{entry.pm_mood_observation}"
                </span>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}