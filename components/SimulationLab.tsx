import React from 'react';
import { Play, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Camera } from 'lucide-react';

const VenetiaSimulationLab = () => {
  // Historical Correspondence Data
  const correspondenceData = [
    {
      id: 126,
      venetiaHeader: "Penrhos, Holyhead — Aug 19th 1914",
      venetia: "My darling, Thank you for your letter. You ask what I am doing. It seems very peaceful here compared to your life. I have been yawning up to the waist all the morning, and this afternoon I rode my unbroken horse. Now I am sitting in the little square garden writing my letters. I have just been reading over your letters, and I do not find them too long! They are a great joy to me. Yrs Venetia",
      asquithHeader: "10 Downing Street, Whitehall — Aug 20th 1914",
      asquith: "My darling Venetia, I received your 'most delicious letter' this morning. I can see you clearly: yawning up to the waist all the morning, riding your unbroken horse in the afternoon, sitting in the little square garden... writing your letters.",
      date: "Aug 20, 1914"
    },
    {
      id: 31,
      venetiaHeader: "Alderley Park, Chelford, Cheshire — Feb 4th 1914",
      venetia: "My dearest H. Thank you for your letter. It sounds as if you are having a fierce time with the Cabinet and the King. I must say I envy you, I should like to be you with your 'crowded hours' and excitement, instead of staying here where nothing happens and one day is exactly like another. I was wondering what had happened to the paragraph... Has it gone in? I am going to hunt tomorrow if it is fine. I hope you are winning at Bridge. Yrs Venetia",
      asquithHeader: "10 Downing Street, Whitehall — Feb 5th 1914",
      asquith: "My darling Venetia, Thank you for your 'very dear letter' received this morning. When you say you would like to be me, with 'crowded hours' &c, I wonder if you realise what it means... to have to tackle (1) your Cabinet (2) your deep-sea fishes (3) your Sovereign.",
      date: "Feb 5, 1914"
    }
  ];

  // Instagram Feed Mock Data updated for the August post
  const instagramPosts = [
    {
      id: 1,
      user: "venetia_official",
      image: "https://images.unsplash.com/photo-1599908608021-b5d299ca2ef1?auto=format&fit=crop&q=80&w=400",
      caption: "A peaceful afternoon in the little square garden at Penrhos. 🌿 Spent the morning yawning, but finally got around to my unbroken horse. Writing back to London now. #Penrhos #Correspondence",
      likes: 92,
      comments: [
        { user: "hh_asquith", text: "A most delicious update to receive at Downing Street. I can almost see the garden from here." },
        { user: "violet_abc", text: "Be careful with that horse, Venetia!" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#DED9D0] flex font-serif p-4 md:p-8 gap-8 overflow-hidden">
      {/* Left Column: Generative Correspondence */}
      <section className="flex-1 max-w-4xl overflow-y-auto pr-6 custom-scrollbar">
        <header className="mb-12">
          <p className="text-[#4A7C59] font-black uppercase tracking-[0.3em] text-[10px] mb-2">The Venetia Project Simulation Lab</p>
          <h1 className="text-4xl font-bold text-[#1A2A40] mb-2 tracking-tight">Generative Correspondence</h1>
          <div className="h-1 w-24 bg-[#4A7C59]"></div>
          <p className="mt-4 text-sm italic text-[#6B7280]">Historical Reconstruction: Mapping the precursors to Asquith's verified archives.</p>
        </header>

        <div className="space-y-24 pb-20">
          {correspondenceData.map((pair) => (
            <div key={pair.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative items-start">
              {/* Venetia Simulated Letter */}
              <div className="bg-[#FAF7F2] p-8 border border-dashed border-[#A67C52]/40 shadow-sm relative -rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="absolute -top-3 left-4 bg-[#A67C52] text-white text-[8px] px-2 py-0.5 rounded uppercase font-black tracking-widest">
                  Simulated Precursor
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[#A67C52]/60 mb-4 font-sans font-bold">
                  {pair.venetiaHeader}
                </div>
                <div className="font-serif italic text-base text-[#4B5563] leading-relaxed">
                  "{pair.venetia}"
                </div>
                <p className="mt-6 text-xs font-bold text-[#A67C52]/60 font-sans tracking-widest">— V.S.</p>
              </div>

              {/* Asquith Verified Letter */}
              <div className="bg-white p-8 border border-[#D4CFC4] shadow-md relative rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="absolute -top-3 left-4 bg-[#4A7C59] text-white text-[8px] px-2 py-0.5 rounded uppercase font-black tracking-widest">
                  Verified Archive
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[#4A7C59]/60 mb-4 font-sans font-bold">
                  {pair.asquithHeader}
                </div>
                <h3 className="font-bold text-[#1A2A40] mb-2 tracking-wide uppercase text-xs">H.H. Asquith</h3>
                <div className="font-serif text-base text-[#1A2A40] leading-relaxed">
                  "{pair.asquith}"
                </div>
                <p className="mt-6 text-[9px] text-[#6B7280] uppercase tracking-tighter font-sans border-t pt-4 border-dotted">
                  Source: record group 1912.b-16 // Folio {pair.id}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Right Column: Media Stack */}
      <aside className="w-[380px] hidden lg:flex flex-col gap-8 flex-shrink-0 overflow-y-auto custom-scrollbar">
        {/* Video Reconstruction Box */}
        <div className="bg-[#EBE7DF] rounded-2xl p-6 border border-[#C4BFAF] shadow-sm">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6B7280] mb-4 text-center">Visual Reconstruction</p>
          <div className="aspect-square rounded-full border-[12px] border-[#3D2B1F] overflow-hidden shadow-2xl relative bg-black group ring-4 ring-[#A67C52]/20">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Asquith_Q_42036_%28cropped%29%28b%29.jpg/250px-Asquith_Q_42036_%28cropped%29%28b%29.jpg" 
              className="w-full h-full object-cover opacity-60 grayscale group-hover:opacity-80 transition-all duration-700"
              alt="H.H. Asquith"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-white/20 hover:bg-white/40 p-5 rounded-full backdrop-blur-md border border-white/30 transition-all transform hover:scale-110 shadow-lg">
                <Play className="text-white fill-current translate-x-0.5" size={28} />
              </button>
            </div>
            <div className="absolute bottom-10 w-full text-center">
               <p className="text-white text-[9px] uppercase font-black tracking-[0.3em] drop-shadow-md">May 12, 1915</p>
            </div>
          </div>
          <p className="text-center mt-6 text-[#1A2A40] font-serif italic text-sm font-bold leading-tight px-4">
            "Engagement Day Message" <br/>
            <span className="text-[10px] not-italic font-sans text-gray-500 uppercase tracking-widest">Reconstructed: 12.05.1915</span>
          </p>
        </div>

        {/* Instagram Displacement Box */}
        <div className="bg-white rounded-[40px] border-[10px] border-[#1A2A40] h-[640px] shadow-2xl flex flex-col overflow-hidden relative mb-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1A2A40] rounded-b-2xl z-20 shadow-sm"></div>
          
          <div className="flex-1 overflow-y-auto mt-6 no-scrollbar">
            {/* Header */}
            <div className="px-4 py-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border-2 border-[#4A7C59] p-0.5">
                    <div className="w-full h-full rounded-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Venetia_Stanley.jpg/220px-Venetia_Stanley.jpg')] bg-cover bg-center"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold font-sans tracking-tight">venetia_official</span>
                  <span className="text-[9px] text-gray-400 font-sans font-medium uppercase tracking-tighter">Holyhead, Wales</span>
                </div>
              </div>
              <MoreHorizontal size={18} className="text-gray-400" />
            </div>

            {/* Post Content */}
            {instagramPosts.map(post => (
              <div key={post.id} className="pb-4">
                <div className="aspect-square bg-gray-100 overflow-hidden relative">
                  <img src={post.image} className="w-full h-full object-cover sepia-[0.2] contrast-110" alt="Post" />
                  <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm p-1.5 rounded-full">
                     <Camera size={14} className="text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex gap-4 mb-3">
                    <Heart size={22} className="hover:text-red-500 cursor-pointer transition-colors" />
                    <MessageCircle size={22} className="hover:text-gray-600 transition-colors" />
                    <Send size={22} />
                    <div className="ml-auto"><Bookmark size={22} /></div>
                  </div>
                  <p className="text-[12px] font-bold font-sans mb-1.5 text-gray-800">{post.likes} likes</p>
                  <p className="text-[12px] font-sans leading-relaxed">
                    <span className="font-bold mr-2 text-gray-900">{post.user}</span>
                    {post.caption}
                  </p>
                  
                  <div className="mt-4 space-y-2 border-l-2 border-gray-100 pl-3">
                    {post.comments.map((comment, i) => (
                      <p key={i} className="text-[11px] font-sans leading-snug">
                        <span className="font-bold mr-2 text-gray-900">{comment.user}</span>
                        <span className="text-gray-600">{comment.text}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Nav Bar */}
          <div className="border-t py-4 flex justify-around items-center bg-gray-50 mt-auto">
             <div className="w-6 h-6 rounded-md border-2 border-gray-300"></div>
             <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
             <div className="w-5 h-5 bg-gray-300 rounded-sm rotate-45"></div>
          </div>
        </div>
      </aside>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(74, 124, 89, 0.2); border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default VenetiaSimulationLab;