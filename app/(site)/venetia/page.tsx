'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useChatVisibility } from '@/components/chat/useChatVisibility';
import { PEOPLE_IMAGES } from '@/constants';

interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  imageKey: string;
  quotes: string[];
  summary: string;
}

interface HandwrittenQuote {
  id: string;
  category: string;
  quote: string;
}

const carouselSlides: CarouselSlide[] = [
  {
    id: 'asquith',
    title: 'H.H. Asquith',
    subtitle: 'The Devotee',
    imageKey: 'H.H. Asquith',
    quotes: [
      'You are the only woman I have known who can think in the real sense... it was born in, & with, you.',
      'You have been the pole-star of my life.',
      'Of the last class of mountains… there is no more conspicuous example than Mount Venetia!'
    ],
    summary: 'He built a mythic Venetia—his "pole-star" and intellectual equal—comparing her to a dangerous mountain climb ("Mount Venetia") where a false step meant destruction.'
  },
  {
    id: 'margot',
    title: 'Margot Asquith',
    subtitle: 'The Critic',
    imageKey: 'Margot Asquith',
    quotes: [
      'Deceitful little brute... No music in her!',
      'How I loathe girls who can\'t love but claim and collect like a cuckoo for their own vanity.',
      'If Venetia had an ounce of truth and candour… I should smile.'
    ],
    summary: 'She viewed Venetia as predatory and vain, dismissing her as a "cuckoo" who collected people for vanity and lacked genuine refinement.'
  },
  {
    id: 'violet',
    title: 'Violet Asquith',
    subtitle: 'The Disillusioned Friend',
    imageKey: 'Violet Asquith',
    quotes: [
      'A transformed being… bright and avenante… shooting glittering glances hither and thither.',
      'The whole thing simply revolts me both in its physical and spiritual aspect.',
      'She is willing to renounce England and Christianity.'
    ],
    summary: 'Initially admiring Venetia\'s "glittering glances," Violet turned to revulsion when Venetia converted to Judaism for marriage, seeing it as a betrayal of values.'
  },
  {
    id: 'montagu',
    title: 'Edwin Montagu',
    subtitle: 'The Frustrated Suitor',
    imageKey: 'Edwin Montagu',
    quotes: [
      'You are most frighteningly reserved about yourself.',
      'The inner you is as hidden from me... as it was a year ago.',
      'You are the most desperately beloved of all women.'
    ],
    summary: 'He found her "most frighteningly reserved" and feared he never truly "had" her, even as he described her as the "most desperately beloved of all women."' 
  },
  {
    id: 'jones',
    title: 'Sir Lawrence Jones',
    subtitle: 'The Contemporary',
    imageKey: 'Sir Lawrence Jones',
    quotes: [
      'A splendid, virginal, comradely creature.',
      'Venetia had… a masculine intellect… she permitted herself no recourse to her own femininity.',
      'She carried the Anthologies in her head, but rode like an Amazon.'
    ],
    summary: 'He saw her "masculine intellect" and "casual stride," noting she had "no recourse to her own femininity" and was "brutally careless of her person."' 
  },
  {
    id: 'diana',
    title: 'Diana Cooper',
    subtitle: 'The Social Critic',
    imageKey: 'Diana Cooper',
    quotes: [
      'Dressed like an elephant in \'howdahs\' and sham Eastern spoils.'
    ],
    summary: 'A sharp critique of Venetia\'s eccentric and often heavy-handed fashion sense later in life.'
  },
  {
    id: 'duff',
    title: 'Duff Cooper',
    subtitle: 'The Analyst',
    imageKey: 'Duff Cooper',
    quotes: [
      'Fingering her hair, speaking seldom... watching with anxiety the servants.',
      'Speaking seldom and with quick assurance, while watching… the food and the wine.'
    ],
    summary: 'He saw through her confidence, observing the anxiety and silence that lay beneath her social performance at dinner parties.'
  }
];

const handwrittenQuotes: HandwrittenQuote[] = [
  {
    id: 'emotion',
    category: 'On Emotion',
    quote: 'I\'m completely cold-blooded—detached from all interest in my own life... my supply of emotion is a thin & meagre one.'
  },
  {
    id: 'money',
    category: 'On Money',
    quote: 'I\'m going to be quite honest... I think one is happier rich than poor.'
  },
  {
    id: 'morality',
    category: 'On Morality',
    quote: 'I wish to God I\'d got a really well defined idea of right & wrong, but nothing that one does to oneself seems wrong.'
  },
  {
    id: 'motivation',
    category: 'On Motivation',
    quote: 'My desire for a new sensation is too strong.'
  },
  {
    id: 'religion',
    category: 'On Religion',
    quote: 'Were I to be washed a 1000 times in the water of Jordan & to go through every rite & ceremony that the strictest Jewish creed involves I should not feel I had changed my race or nationality.'
  },
  {
    id: 'marriage',
    category: 'On Marriage',
    quote: 'We can have such fun together and are & I\'m sure could be so really happy, & if that cant be made a good basis for marriage I dont know that I shall ever find a better'
  },
  {
    id: 'her_nature',
    category: 'On Her Nature',
    quote: 'I\'m a fool who doesnt know what she wants...I advise you to bully me once we are married. I\'m sure its the only way'
  },
  {
    id: 'war',
    category: 'On The War',
    quote: 'My darling I foresee that in a very short time I shall become a real war bore'
  },
    {
    id: 'asquith',
    category: 'On The Prime Minister',
    quote: "It would be absurd to pretend that his unhappiness doesn't affect me very deeply, how could it not, for 3 years he has been to me the most wonderful friend and companion."
  }
];


const dailySchedule = [
  { time: 'Morning', marker: 'I', activity: 'Fence with Mistress Katharine.' },
  { time: 'Midday', marker: 'II', activity: 'Eurhythmics call me next.' },
  { time: 'Luncheon', marker: 'III', activity: 'Tête à tête.' },
  { time: 'Afternoon', marker: 'IV', activity: 'To the City—to select / Rare fine-spun lingerie.' },
  { time: 'Evening', marker: 'V', activity: 'A hasty rubber (Bridge).' },
  { time: 'Night', marker: 'VI', activity: 'A rest, a dance / A supper.' },
  { time: '3:30 AM', marker: 'VII', activity: 'I go to bed... To do it all again.' }
];


const bookshelf = [
  { category: 'Russian Lit', books: ['The Brothers Karamazov', 'Crime & Punishment'], author: 'Dostoevsky' },
  { category: 'The Classics', books: ['Barchester Towers'], author: 'Trollope', note: '"Great fun"' },
  { category: 'Philosophy', books: ['Marius the Epicurean'], author: 'Pater' },
  { category: 'Poetry', books: ['The Divine Comedy (Inferno)'], author: 'Dante', note: 'Read aloud, translating horrors "with great gusto"' }
];

const hobbies = [
  { title: 'The Menagerie', description: 'Owned a bear, a fox, a penguin, and a monkey named Pluto.', image: '/venetia-page/venetia-hobby-bear.png' },
  { title: 'Gambling', description: 'Poker and Bridge for money with "zest & determination".', image: '/venetia-page/venetia-gambling.jpg' },
  { title: 'Sport', description: 'Fencing (3x a week) and Tennis.', image: '/venetia-page/venetia-tennis.png' }
];

export default function VenetiaPage() {
  useChatVisibility(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);
  const carouselRef = React.useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const nextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % handwrittenQuotes.length);
  };

  const prevQuote = () => {
    setCurrentQuote((prev) => (prev - 1 + handwrittenQuotes.length) % handwrittenQuotes.length);
  };

  return (
    <div className="h-full bg-page-bg">
      <div className="mx-auto max-w-7xl">
        {/* 1. Hero Section - COMPACT VERSION */}
<section className="w-full bg-navy/95 py-12 md:py-20 border-b border-white/10 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-8 md:gap-16">

            {/* LEFT COL: The Portrait (Sized Down) */}
            <div className="w-full md:w-5/12 flex justify-center md:justify-end z-10">
              {PEOPLE_IMAGES['Venetia Stanley'] && (
                <div className="relative aspect-[3/4] w-full max-w-sm rounded-sm overflow-hidden shadow-2xl filter sepia-[0.05] contrast-110">
                  <img
                    src={PEOPLE_IMAGES['Venetia Stanley']}
                    alt="Venetia Stanley"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.5)]" />
                </div>
              )}
            </div>

            {/* RIGHT COL: Text & Audio (Tighter Spacing) */}
            <div className="w-full md:w-7/12 text-left space-y-5 z-10">
              
              {/* Title Block */}
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-page-bg mb-4 leading-none tracking-tight drop-shadow-lg">
                  The Enigma of <br/>
                  <span className="text-accent-brown">Venetia Stanley</span>
                </h1>
                <div className="w-20 h-[2px] bg-accent-brown opacity-80" />
              </div>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-page-bg/90 italic font-serif leading-snug drop-shadow-md max-w-lg">
                The &quot;Pole star&quot; of the Edwardian Era—Intellectual, Hedonist, and &quot;Uncertain Prop.&quot;
              </p>

              {/* Intro Text */}
              <p className="text-base text-page-bg/70 font-normal leading-relaxed tracking-wide max-w-lg border-t border-white/10 pt-5">
                In an era of rigid social codes and impending war, she was a brilliant anomaly. A woman who commanded the obsession of the most powerful men in the Empire, leaving a trail of burned letters and broken hearts in her wake.
              </p>

              {/* Hero Podcast Player (Integrated tightly) */}
              <div className="bg-navy border border-white/10 rounded-sm p-4 max-w-md mt-6 group hover:border-accent-red/50 transition-colors">
                <div className="mb-3 flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-muted-gray uppercase tracking-[0.2em] mb-1">
                        Audio Biography
                      </span>
                      <span className="text-card-bg font-serif text-sm">
                        Venetia Stanley: Cool, Clever, Unavailable
                      </span>
                   </div>
                </div>
                <audio 
                  controls 
                  className="w-full h-8"
                >
                  <source src="/audio/venetia.mp3" type="audio/mpeg" />
                  <source src="/audio/venetia.m4a" type="audio/mp4" />
                  Your browser does not support the audio element.
                </audio>
              </div>

            </div>
          </div>
          
          {/* Background Texture */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('/images/noise.png')] mix-blend-overlay"></div>
        </section>


        {/* 2. How Others Saw Her - Full-Width Carousel */}
        <section className="w-full bg-page-bg py-12 md:py-16">
          <div className="px-4 md:px-6 mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-navy mb-2 text-center">
              The Object of Obsession
            </h2>
          </div>
          
          <div className="relative w-full" ref={carouselRef}>
            {/* Navigation Buttons (anchored to content width) */}
            <div className="pointer-events-none absolute inset-0 z-20">
              <div className="relative h-full px-4 md:px-6">
                <button
                  onClick={prevSlide}
                  className="pointer-events-auto absolute left-0 top-1/2 -translate-y-1/2 bg-card-bg/90 hover:bg-card-bg text-navy rounded-full p-2.5 md:p-3 lg:p-4 shadow-lg transition-all border border-border-beige min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 bg-card-bg/90 hover:bg-card-bg text-navy rounded-full p-2.5 md:p-3 lg:p-4 shadow-lg transition-all border border-border-beige min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>

            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselSlides.map((slide) => (
                  <div key={slide.id} className="min-w-full flex">
                    <div className="w-full px-4 md:px-6 flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                      {/* Image - 1/3 */}
                      <div className="w-full md:w-1/3 flex-shrink-0">
                        <div className="relative aspect-[3/4] bg-navy rounded-lg overflow-hidden">
                          {PEOPLE_IMAGES[slide.imageKey as keyof typeof PEOPLE_IMAGES] ? (
                            <img
                              src={PEOPLE_IMAGES[slide.imageKey as keyof typeof PEOPLE_IMAGES]}
                              alt={slide.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-navy via-slate to-accent-green flex items-center justify-center">
                              <div className="text-4xl md:text-6xl font-serif text-white/20">
                                {slide.title.charAt(0)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Text - 2/3 */}
                      <div className="w-full md:w-2/3 flex-shrink-0 space-y-4 md:space-y-6">
                        <div>
                          <h3 className="text-2xl md:text-3xl font-serif font-bold text-navy mb-1">
                            {slide.title}
                          </h3>
                          <p className="text-base md:text-lg text-slate italic">
                            {slide.subtitle}
                          </p>
                        </div>
                        <div className="space-y-2 md:space-y-3">
                          {slide.quotes.map((quote, index) => (
                            <blockquote key={index} className="text-base md:text-lg font-serif italic text-navy border-l-4 border-accent-green pl-4 md:pl-6 py-2">
                              &quot;{quote}&quot;
                            </blockquote>
                          ))}
                        </div>
                        <p className="text-base md:text-lg text-navy leading-relaxed">
                          {slide.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="px-4 md:px-6">
              <div className="flex justify-center gap-2 mt-6 md:mt-8">
                {carouselSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all min-w-[8px] ${ index === currentSlide ? 'w-8 bg-accent-green' : 'w-2 bg-border-beige'}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Private Life - Split Section */}
        <section className="w-full bg-section-bg py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16">
              
              {/* Left Column (2/3): In Her Own Words - OVERLAP LAYOUT */}
              <div className="w-full lg:w-2/3 space-y-6 md:space-y-8">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-navy mb-6 md:mb-8 border-b border-navy/10 pb-3 md:pb-4">
                  In Her Own Words
                </h3>
                
                {/* The Overlap Container */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start">
                  
                  {/* 1. The Image (Base Layer) */}
                  <div className="w-full md:w-5/12 shrink-0 z-0 relative">
                    <div className="aspect-3/4 bg-navy rounded-sm overflow-hidden shadow-lg filter sepia-[0.2]">
                      {PEOPLE_IMAGES['Venetia Stanley'] && (
                        <img
                          src={PEOPLE_IMAGES['Venetia Stanley']}
                          alt="Venetia Stanley"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>

                  {/* 2. The Quote Card (Top Layer) - Overlapping */}
                  <div className="w-full md:w-8/12 z-10 -mt-6 md:-mt-8 md:mt-12 md:-ml-16">
                    <div className="relative bg-page-bg rounded-sm p-6 md:p-8 lg:p-10 shadow-xl border-l-4 border-navy">
                      
                      <div className="absolute top-3 md:top-4 right-4 md:right-6 text-6xl md:text-9xl font-serif text-navy/5 leading-none pointer-events-none">
                        &quot;
                      </div>

                      <div className="relative z-10 space-y-4 md:space-y-6 min-h-[180px] md:min-h-[220px] flex flex-col justify-center">
                        {/* The "Lens" Label */}
                        <div className="flex items-center gap-2 md:gap-3 mb-2">
                          <span className="h-[1px] w-6 md:w-8 bg-accent-brown"></span>
                          <p className="text-[10px] md:text-xs font-bold text-accent-brown uppercase tracking-[0.2em]">
                            {handwrittenQuotes[currentQuote].category}
                          </p>
                        </div>

                        <p className="text-lg md:text-xl lg:text-2xl font-serif text-navy leading-relaxed">
                          {handwrittenQuotes[currentQuote].quote}
                        </p>
                      </div>
                      
                      {/* Navigation Controls */}
                      <div className="flex items-center justify-between mt-6 md:mt-8 pt-4 md:pt-6 border-t border-navy/10">
                        <div className="flex gap-1.5">
                          {handwrittenQuotes.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentQuote(index)} 
                              className={`h-1.5 rounded-full transition-all duration-300 min-w-[6px] ${ index === currentQuote ? 'w-8 bg-navy' : 'w-1.5 bg-navy/20 hover:bg-navy/40'}`}
                              aria-label={`Go to quote ${index + 1}`}
                            />
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={prevQuote}
                            className="p-2 text-navy hover:bg-navy/5 rounded-full transition-colors border border-navy/20 min-w-[44px] min-h-[44px] flex items-center justify-center"
                            aria-label="Previous quote"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={nextQuote}
                            className="p-2 text-navy hover:bg-navy/5 rounded-full transition-colors border border-navy/20 min-w-[44px] min-h-[44px] flex items-center justify-center"
                            aria-label="Next quote"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (1/3): A Day in the Life */}
              <div className="w-full lg:w-1/3 border-t lg:border-t-0 lg:border-l border-navy/10 lg:pl-8 xl:pl-12 pt-8 lg:pt-0 space-y-6 md:space-y-8">
                <div>
                    <h3 className="text-lg md:text-xl font-serif font-bold text-navy mb-2">
                      A Day in the Life
                    </h3>
                    <p className="text-[10px] md:text-xs text-muted-gray uppercase tracking-wider mb-4 md:mb-6">
                      1912–1915 • Based on Asquith&apos;s Poem
                    </p>
                </div>

                <div className="space-y-0 relative">
                    {/* Continuous Vertical Timeline Line */}
                    <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-navy/10 z-0"></div>

                    {dailySchedule.map((item, index) => (
                      <div key={index} className="flex gap-5 items-start relative z-10 pb-8 last:pb-0">
                        {/* Roman Numeral Circle */}
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-section-bg border-2 border-navy text-navy font-serif text-xs font-bold shadow-sm z-10">
                          {item.marker} 
                        </span>
                        
                        {/* Content */}
                        <div className="pt-1">
                          <p className="font-bold text-navy text-sm uppercase tracking-wide mb-1">
                            {item.time}
                          </p>
                          <p className="text-navy font-serif text-lg italic leading-snug">
                            {item.activity}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

            </div>
          </div>
        </section>
        {/* 4. The Cultural Life - Split Section */}
        <section className="w-full bg-section-bg py-12 md:py-16 lg:py-20 border-t border-navy/10">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            
            <div className="mb-10 md:mb-12 lg:mb-16 text-center">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-navy mb-2 md:mb-3">Intellect & Vice</h3>
              <p className="text-muted-gray font-serif italic text-base md:text-lg">&quot;A whetted appetite and zest for the pleasures of the world&quot;</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
              
              {/* LEFT COL: The Bookshelf (Upgraded) */}
              <div className="w-full lg:w-1/2 space-y-8">
                <h3 className="text-2xl font-serif font-semibold text-navy pl-4 border-l-4 border-navy">
                  The Bookshelf
                </h3>

                {/* The "Library Card" Container */}
                <div className="bg-page-bg rounded-sm shadow-sm border border-border-beige overflow-hidden">
                  
                  {/* THE IMAGE HEADER */}
                  <div className="relative h-64 w-full border-b border-navy/10">
                    <div className="absolute inset-0 bg-navy/10 mix-blend-multiply z-10" /> 
                    <img 
                      src="/venetia-page/venetia_bookshelf.jpg" 
                      alt="Edwardian Bookshelf"
                      className="w-full h-full object-cover"
                    />
                    
                    <div className="absolute bottom-4 left-6 z-20">
                      <span className="bg-page-bg text-navy px-3 py-1 text-xs font-bold uppercase tracking-widest border border-navy/20 shadow-sm">
                        Venetia&apos;s Library
                      </span>
                    </div>
                  </div>

                  {/* The List Content */}
                  <div className="p-8 space-y-8 relative">
                    <div className="absolute top-10 right-0 text-[10rem] font-serif text-navy/5 leading-none pointer-events-none -mr-4">
                      &amp;
                    </div>

                    {/* Category 1: Russian Lit */}
                    <div className="group border-b border-navy/10 pb-6 last:border-0 relative z-10">
                      <p className="text-xs font-bold text-accent-brown uppercase tracking-widest mb-1">Heavy Reading</p>
                      <h4 className="text-xl font-serif font-bold text-navy mb-2">
                        Russian Literature
                      </h4>
                      <p className="text-slate font-serif italic mb-2">
                        &quot;The Brothers Karamazov&quot; &amp; &quot;Crime &amp; Punishment&quot;
                      </p>
                      <p className="text-xs text-muted-gray leading-relaxed">
                        She read Dostoevsky obsessively in 1914, finding his chaotic morality a mirror for her own life.
                      </p>
                    </div>

                    {/* Category 2: The Classics */}
                    <div className="group border-b border-navy/10 pb-6 last:border-0 relative z-10">
                      <p className="text-xs font-bold text-accent-brown uppercase tracking-widest mb-1">The Foundation</p>
                      <h4 className="text-xl font-serif font-bold text-navy mb-2">
                        Greek &amp; Roman Classics
                      </h4>
                      <p className="text-slate font-serif italic mb-2">
                        &quot;Winchester Troopers&quot; (Dialogue) — &quot;Great fun&quot;
                      </p>
                      <p className="text-xs text-muted-gray leading-relaxed">
                          Educated far beyond the standard for women of her time, she could debate Asquith on nuances of Greek translation.
                      </p>
                    </div>

                      {/* Category 3: Poetry */}
                      <div className="group pb-2 last:border-0 relative z-10">
                      <p className="text-xs font-bold text-accent-brown uppercase tracking-widest mb-1">Verse</p>
                      <h4 className="text-xl font-serif font-bold text-navy mb-2">
                        Dante &amp; The Moderns
                      </h4>
                      <p className="text-slate font-serif italic mb-2">
                        &quot;The Divine Comedy (Inferno)&quot;
                      </p>
                      <p className="text-xs text-muted-gray leading-relaxed">
                          Read aloud, translating horrors &quot;with great gusto&quot; to anyone who would listen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>


              {/* RIGHT COL: Hobbies (Existing - just ensuring height matches) */}
              <div className="w-full lg:w-1/2 space-y-8">
                <h3 className="text-2xl font-serif font-semibold text-navy pl-4 border-l-4 border-navy">
                  Hobbies
                </h3>
                
                <div className="grid gap-8">
                  {hobbies.map((hobby, index) => (
                    <div 
                      key={index} 
                      className="group flex flex-col sm:flex-row bg-page-bg rounded-sm border border-border-beige shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                    >
                      {/* Image (Left on desktop) */}
                      <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden bg-navy">
                        <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-all z-10" />
                        <img 
                          src={hobby.image} 
                          alt={hobby.title}
                          className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        />
                      </div>

                      {/* Text (Right) */}
                      <div className="sm:w-3/5 p-6 flex flex-col justify-center relative">
                        {/* Diamond Notch */}
                        <div className="hidden sm:block absolute left-0 top-1/2 -translate-x-1/2 w-4 h-4 bg-page-bg rotate-45 border-l border-b border-border-beige z-20"></div>
                        
                        <h4 className="text-xl font-serif font-bold text-navy mb-2">
                          {hobby.title}
                        </h4>
                        <p className="text-slate text-sm leading-relaxed font-serif italic">
                          {hobby.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 5. Footer */}
        <footer className="w-full bg-section-bg py-20 border-t border-border-beige relative overflow-hidden">
  
          {/* Background Texture: Subtle paper grain */}
          <div className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-multiply" 
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
          </div>

          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 lg:gap-20 relative z-10">
            
            {/* LEFT COLUMN: The Narrative Context */}
            <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
              <div>
                {/* Archival Label */}
                <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                  <div className="w-8 h-[1px] bg-accent-brown/40"></div>
                  <span className="text-[10px] font-black text-accent-brown uppercase tracking-[0.25em]">
                    The 1928 Footage
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-4 leading-tight">
                  A Glimpse of Venetia.
                </h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-lg md:text-xl text-muted-gray font-serif font-normal leading-relaxed">
                  H.H. Asquith destroyed nearly all her letters. The &quot;Venetia&quot; we know is mostly constructed from his obsession.
                </p>              
                
                {/* The "Handwritten" Note Style */}
                <div className="pl-5 border-l-[3px] border-accent-brown/30 text-left mx-auto md:mx-0 max-w-lg">
                  <p className="text-lg text-accent-brown font-serif italic leading-relaxed mb-2">
                    But one rare glimpse remains.
                  </p>
                  <p className="text-sm md:text-base text-muted-gray font-medium leading-relaxed">
                    This archival footage from 1928 captures Venetia at Alderley Edge,
                    playing bridge with her mother. It is a silent testament to the
                    woman who outlived the scandal to find her own quiet, sharp-witted peace.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: The Video Link Card (Styled as a Framed Photo) */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
              
              {/* Decorative "Tape" or Shadow beneath */}
              <div className="absolute -bottom-6 -right-6 w-full max-w-lg h-full border border-accent-brown/10 rounded-sm -z-10 hidden md:block" />

              <a 
                href="https://www.bridgemanimages.com/en/noartistknown/venetia-montagu-and-dowager-lady-stanley-of-alderley-playing-bridge/footage/asset/486980"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full max-w-lg aspect-video bg-black rounded-sm overflow-hidden shadow-[0_20px_50px_rgba(26,42,64,0.15)] border-[8px] border-white transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(26,42,64,0.2)]"
              >
                {/* 1. The "Silent Film" Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#101010]">
                  
                  <div className="absolute inset-0 opacity-30 pointer-events-none" 
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
                  </div>
                  
                  <div className="absolute inset-0 bg-accent-brown/20 mix-blend-overlay"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_120%)] opacity-80"></div>

                  <div className="z-10 text-center space-y-3 opacity-70 group-hover:opacity-50 transition-opacity duration-500">
                    <p className="text-page-bg font-serif text-3xl md:text-4xl tracking-[0.2em] font-bold drop-shadow-md">
                      ARCHIVE
                    </p>
                    <div className="w-16 h-[1px] bg-page-bg/50 mx-auto"></div>
                    <p className="text-page-bg/80 font-mono text-[10px] tracking-[0.3em] uppercase">
                      Alderley Edge, 1928
                    </p>
                  </div>
                </div>

                {/* 2. The Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-page-bg/10 backdrop-blur-sm border border-page-bg/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-page-bg/20 transition-all duration-300 shadow-2xl">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-page-bg border-b-[10px] border-b-transparent ml-1 opacity-90 group-hover:opacity-100"></div>
                  </div>
                </div>

                {/* 3. The Source Footer (Inside the frame) */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md px-4 py-2 flex justify-between items-center z-30">
                  <span className="text-[10px] text-page-bg font-bold uppercase tracking-wider flex items-center gap-2 group-hover:text-white transition-colors">
                    Watch Footage <span className="text-accent-red">↗</span>
                  </span>
                  <span className="text-[9px] text-muted-gray">
                    Bridgeman Images
                  </span>
                </div>
              </a>
            </div>

          </div>
        </footer>
      </div>
    </div>
  );
}