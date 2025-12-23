'use client';

import React, { useCallback, useRef, useState } from 'react';
import { Play, Pause, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Camera, Info } from 'lucide-react';

const VenetiaSimulationLab = () => {
  const reconstructionAudioRef = useRef<HTMLAudioElement>(null);
  const [isReconstructionPlaying, setIsReconstructionPlaying] = useState(false);
  
  // State for toggling the logic panels
  const [expandedLogic, setExpandedLogic] = useState<Record<number, boolean>>({});

  const toggleLogic = (id: number) => {
    setExpandedLogic(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePlayReconstruction = useCallback(() => {
    const audio = reconstructionAudioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.currentTime = 0;
      void audio.play().catch(() => undefined);
      return;
    }

    audio.pause();
  }, []);

  // Historical Correspondence Data with Logic Added
  const correspondenceData = [
    {
      id: 31,
      venetiaHeader: "Alderley Park, Chelford, Cheshire — Feb 4th 1914",
      venetia: "My dearest H. Thank you for your letter. It sounds as if you are having a fierce time with the Cabinet and the King. I must say I envy you, I should like to be you with your 'crowded hours' and excitement, instead of staying here where nothing happens and one day is exactly like another. I was wondering what had happened to the paragraph, the one you wrote when you were here. Has it gone in? I suppose I ought to have asked to see it, but I didn’t like to bother you. I am going to hunt tomorrow if it is fine. I hope you are winning at Bridge. Yrs Venetia",
      asquithHeader: "10 Downing Street, Whitehall — Feb 5th 1914",
      asquith: "My darling Venetia, Thank you for your 'very dear letter' received this morning. When you say you would like to be me, with 'crowded hours' &c, I wonder if you realise what it means... to have to tackle (1) your Cabinet (2) your deep-sea fishes (3) your Sovereign.",
      logic: `• "Crowded hours": In Letter 31, Asquith writes: "When you say you would like to be me, with 'crowded hours' &c, I wonder if you realise what it means... to have to tackle (1) your Cabinet (2) your deep-sea fishes (3) your Sovereign."

• The Paragraph: In Letter 31, Asquith responds: "Of course I would have shewn you the 'paragraph', if you had given me a hint that you wanted to see it." Later, in Letter 35, he confirms: "Yes—that was the Alderley paragraph... composed... in a rather gloomy half-hour at Alderley." This refers to a paragraph regarding Home Rule inserted into the King's Speech.

• Tone and Style: Venetia's letters often contrasted her "dull" country life with the excitement of London. For example, she writes elsewhere: "My life has continued in the same peaceful, uneventful way... I have hunted once... I have been very busy and for almost the first time in my life have had too much to do" and "I should like to see you sometime... I long to hear all your news". She often signed simply "Yrs Venetia" or "Yrs V."`
    },
    {
      id: 126,
      venetiaHeader: "Penrhos, Holyhead — Aug 19th 1914",
      venetia: "My darling, Thank you for your letter. You ask what I am doing. It seems very peaceful here compared to your life. I have been yawning up to the waist all the morning, and this afternoon I rode my unbroken horse. Now I am sitting in the little square garden writing my letters. I have just been reading over your letters, and I do not find them too long! They are a great joy to me. Yrs Venetia",
      asquithHeader: "10 Downing Street, Whitehall — Aug 20th 1914",
      asquith: "My darling Venetia, I received your 'most delicious letter' this morning. I can see you clearly: yawning up to the waist all the morning, riding your unbroken horse in the afternoon, sitting in the little square garden... writing your letters.",
      logic: `• "Yawning up to the waist...": In Letter 126, Asquith explicitly recaps her description: "I like to have the picture of your daily life — yawning up to the waist all the morning..."

• "Riding your unbroken horse": Asquith continues his summary of her day: "...riding your unbroken horse in the afternoon..."

• "The little square garden": Asquith mentions she described herself "sitting in the little square garden, wh. I know so well & love so much, writing your letters..."

• Reading his letters: Asquith notes she mentioned "reading over my letters, & not finding them too long!" This was likely a response to his frequent apologies for writing so often and at such length (e.g., in Letter 125 he asks, "I wonder if you have been able to read a line of any of my books...").

• Location: Venetia was at Penrhos, Holyhead at this time; Asquith mentions in Letter 123 (August 17) that she was on her "long journey" there, and in Letter 124 (August 18) he hopes to hear from her from Penrhos.

• Style: The reconstruction adopts Venetia's habit of brief, factual recitations of her day (often involving physical activity like riding or tennis) and her affectionate but relatively understated closing style found in her letters to Edwin Montagu. [venetia_edwin_letters.txt]`
    },
    {
      id: 140,
      venetiaHeader: "Penrhos, Holyhead — Sunday [Aug 30th 1914]",
      venetia: "My dearest H. Thank you for your letter. I feel very far away from the centre of things here. While you are living through such great events, I feel I am doing nothing of any use. I seem to be reduced to running a crèche for the children. I even went to Church this morning! That shows you how desperate I am for occupation. I long to see you. Yrs Venetia",
      asquithHeader: "10 Downing Street, Whitehall — Aug 31st 1914",
      asquith: "My darling Venetia, Thank you for your letter. It is sad to think that in these soul-stirring days you are reduced to running a crèche. And you have even taken to Church-going!",
      logic: `• "Running a Crèche": In Letter 140, Asquith writes: "It is sad to think that in these soul-stirring days you are reduced to running a crèche." This indicates she had described her current daily activities as looking after children (likely her nephews and nieces at the family estate) and contrasted her mundane life with the momentous events ("soul-stirring days") Asquith was managing in London.

• "Taken to Church-going": Asquith adds: "And you have even taken to Church-going!" This comment suggests she had mentioned attending a service, which was unusual enough for her to note and for him to remark upon with an exclamation point. Asquith proceeds to describe his own attendance at a "little Church at Lympne" in response.

• Location: Venetia was at Penrhos, her family's home in Holyhead, during this period in August 1914.

• Tone: The reconstruction reflects Venetia's tendency to describe her country life as dull or trivial compared to the excitement of London, a theme present in her letters to Edwin Montagu (e.g., "My life has continued in the same peaceful, uneventful way"). Her lack of religious fervor is also well-documented, making her attendance at church a notable sign of boredom or conformity to family pressure. [venetia_edwin_letters.txt, Letter 60; naomi_levine-full.txt, Chapter 17]`
    }
  ];

  // Instagram Feed Mock Data
  const instagramPosts = [
    {
      id: 3,
      user: "venetia_official",
      image: "/lab_instagram/venetia_sitting_bored.jpg",
      caption: "Yawning up to the waist all morning in the garden. 🥱 The Prime has written three times before breakfast with all the Cabinet secrets—it is rather nice to be the pole-star, I suppose, but honestly, I’d rather be playing poker. ♠️♦️#countrylife #correspondence #politics #bored #volcanicallydull",
      likes: 112,
      comments: [
        { user: "hh_asquith", text: "Church-going, Venetia? You truly are desperate for distraction!" },
        { user: "violet_abc", text: "A crèche! I can't quite imagine it, darling." }
      ]
    },
    {
        id: 2,
        user: "venetia_official",
        image: "/lab_instagram/venetia_shopping_penguin.jpg",
        caption: "Went shopping for a bear cub today but they were out of stock, so I consoled myself with this penguin. 🐧 He is moderately nice, but still very shy. Now off to the casino—I intend to have fun. 💸🥂 #retailtherapy #penguin #newpet #glamour #fun",
        likes: 95,
        comments: [
          { user: "hh_asquith", text: "I can see you there so clearly." }
        ]
      }
  ];

  return (
    <div className="min-h-screen bg-[#DED9D0] flex font-serif p-4 md:p-8 gap-8 overflow-hidden">
      <audio
        ref={reconstructionAudioRef}
        src="/lab_instagram/asquith_reading_letter2.mp3"
        preload="auto"
        onPlay={() => setIsReconstructionPlaying(true)}
        onPause={() => setIsReconstructionPlaying(false)}
        onEnded={() => setIsReconstructionPlaying(false)}
      />
      
      {/* Left Column: Generative Correspondence */}
      <section className="flex-1 max-w-4xl overflow-y-auto pr-6 custom-scrollbar">
        <header className="mb-12">
          <p className="text-[#4A7C59] font-black uppercase tracking-[0.3em] text-[10px] mb-2">The Venetia Project Simulation Lab</p>
          <h1 className="text-4xl font-bold text-[#1A2A40] mb-2 tracking-tight">Generative Correspondence</h1>
          <div className="h-1 w-24 bg-[#4A7C59]"></div>
          <p className="mt-4 text-sm italic text-[#6B7280]">Chronicle Displacement: Reconstructing the dialogue between Venetia Stanley and the Prime Minister.</p>
        </header>

        <div className="space-y-24 pb-32">
          {correspondenceData.map((pair) => (
            <div key={pair.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative items-start">
              
              {/* Venetia Simulated Letter */}
              <div className="flex flex-col gap-2">
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
                  
                  {/* Logic Toggle Button */}
                  <button 
                    onClick={() => toggleLogic(pair.id)}
                    className="mt-6 flex items-center gap-1.5 text-[10px] font-sans font-bold text-[#A67C52] uppercase tracking-wider hover:text-[#8C6B4A] transition-colors"
                  >
                    <Info size={12} /> 
                    {expandedLogic[pair.id] ? "Hide Reconstruction Logic" : "View Reconstruction Logic"}
                  </button>
                  
                  {/* Expandable Logic Panel */}
                  {expandedLogic[pair.id] && (
                    <div className="mt-3 p-3 bg-[#A67C52]/5 border-l-2 border-[#A67C52] text-[11px] font-sans text-[#7a5a3a] leading-snug animate-in fade-in slide-in-from-top-2">
                      <strong className="block mb-2 opacity-80 uppercase tracking-widest text-[9px]">Basis of Reconstruction:</strong> 
                      <ul className="space-y-2 list-none pl-0">
                        {pair.logic.split('\n').filter(line => line.trim()).map((line, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="text-[#A67C52] font-bold shrink-0">•</span>
                            <span className="flex-1">{line.trim().replace(/^•\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="mt-6 text-xs font-bold text-[#A67C52]/60 font-sans tracking-widest text-right">— V.S.</p>
                </div>
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
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6B7280] mb-4 text-center">Audio Reconstruction</p>
          <div className="aspect-square rounded-full border-[12px] border-[#3D2B1F] overflow-hidden shadow-2xl relative bg-black group ring-4 ring-[#A67C52]/20">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Asquith_Q_42036_%28cropped%29%28b%29.jpg/250px-Asquith_Q_42036_%28cropped%29%28b%29.jpg" 
              className="w-full h-full object-cover opacity-60 grayscale group-hover:opacity-80 transition-all duration-700"
              alt="H.H. Asquith"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  aria-label={isReconstructionPlaying ? "Pause reconstruction audio" : "Play reconstruction audio"}
                  onClick={handlePlayReconstruction}
                  className="bg-white/20 hover:bg-white/40 p-5 rounded-full backdrop-blur-md border border-white/30 transition-all transform hover:scale-110 shadow-lg"
                >
                  {isReconstructionPlaying ? (
                    <Pause className="text-white fill-current" size={28} />
                  ) : (
                    <Play className="text-white fill-current translate-x-0.5" size={28} />
                  )}
                </button>
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
                  <span className="text-[9px] text-gray-400 font-sans font-medium uppercase tracking-tighter">Simulation Feed</span>
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
