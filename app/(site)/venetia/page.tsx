'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
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
    quote: 'We can have such fun together and are & I’m sure could be so really happy, & if that cant be made a good basis for marriage I dont know that I shall ever find a better'
  },
  {
    id: 'her_nature',
    category: 'On Her Nature',
    quote: 'I’m a fool who doesnt know what she wants...I advise you to bully me once we are married. I’m sure its the only way'
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
    <div className="min-h-screen bg-[#E8E4DC]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="bg-[#F5F0E8] border-b border-[#D4CFC4] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-[#1A2A40] hover:text-[#4A7C59] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <h1 className="font-serif text-lg font-medium">The Venetia Project</h1>
            </Link>
          </div>
          <span className="text-[#6B7280] text-base">When AI Meets Primary Sources</span>
          <div className="w-8 h-8 rounded-full bg-[#4A7C59] flex items-center justify-center">
            <span className="text-white text-xs font-medium">V</span>
          </div>
        </header>

        {/* 1. Hero Section */}
        <section className="w-full bg-[#050505] py-16 md:py-24 lg:py-32 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 lg:gap-20">

            {/* LEFT COL: The Portrait */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-start z-10">
              {PEOPLE_IMAGES['Venetia Stanley'] && (
                <div className="relative aspect-[3/4] w-full max-w-md rounded-sm overflow-hidden shadow-2xl filter sepia-[0.05] contrast-110">
                  <img
                    src={PEOPLE_IMAGES['Venetia Stanley']}
                    alt="Venetia Stanley"
                    className="w-full h-full object-cover"
                  />
                  {/* A very subtle vignette to blend the edges into the dark background */}
                  <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
                </div>
              )}
            </div>

            {/* RIGHT COL: The Text */}
            <div className="w-full md:w-1/2 text-left space-y-8 z-10">
              <div>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#F5F0E8] mb-6 leading-none tracking-tight drop-shadow-lg">
                  The Enigma of <br/><span className="text-[#8B4513]">Venetia Stanley</span>
                </h1>
                {/* Decorative line */}
                <div className="w-32 h-[3px] bg-[#8B4513] mb-8 opacity-80" />
              </div>

              <p className="text-2xl md:text-3xl text-[#E8E4DC] italic font-serif leading-snug drop-shadow-md">
                The &quot;Poll-star&quot; of the Edwardian Era—Intellectual, Hedonist, and &quot;Uncertain Prop.&quot;
              </p>

              <p className="text-lg md:text-xl text-gray-200 font-normal leading-relaxed tracking-wide max-w-xl border-t border-white/20 pt-8 drop-shadow-md">
                In an era of rigid social codes and impending war, she was a brilliant anomaly. A woman who commanded the obsession of the most powerful men in the Empire, leaving a trail of burned letters and broken hearts in her wake.
              </p>
            </div>
          </div>
          
          {/* Optional: A subtle background texture or very faint blurred version of her image for depth */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('/images/noise.png')] mix-blend-overlay"></div>
        </section>


        {/* 2. How Others Saw Her - Full-Width Carousel */}
        <section className="w-full bg-[#F5F0E8] py-16">
          <div className="px-6 mb-8">
            <h2 className="text-4xl font-serif font-bold text-[#1A2A40] mb-2 text-center">
              The Object of Obsession
            </h2>
          </div>
          
          <div className="relative w-full" ref={carouselRef}>
            {/* Navigation Buttons (anchored to content width) */}
            <div className="pointer-events-none absolute inset-0 z-20">
              <div className="relative h-full px-6">
                <button
                  onClick={prevSlide}
                  className="pointer-events-auto absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#1A2A40] rounded-full p-3 md:p-4 shadow-lg transition-all border border-[#D4CFC4]"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#1A2A40] rounded-full p-3 md:p-4 shadow-lg transition-all border border-[#D4CFC4]"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6" />
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
                    <div className="w-full px-6 flex flex-col md:flex-row gap-8 items-center">
                      {/* Image - 1/3 */}
                      <div className="w-full md:w-1/3 flex-shrink-0">
                        <div className="relative aspect-[3/4] bg-[#1A2A40] rounded-lg overflow-hidden">
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
                            <div className="w-full h-full bg-gradient-to-br from-[#1A2A40] via-[#2D3648] to-[#4A7C59] flex items-center justify-center">
                              <div className="text-6xl font-serif text-white/20">
                                {slide.title.charAt(0)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Text - 2/3 */}
                      <div className="w-full md:w-2/3 flex-shrink-0 space-y-6">
                        <div>
                          <h3 className="text-3xl font-serif font-bold text-[#1A2A40] mb-1">
                            {slide.title}
                          </h3>
                          <p className="text-lg text-[#6B7280] italic">
                            {slide.subtitle}
                          </p>
                        </div>
                        <div className="space-y-3">
                          {slide.quotes.map((quote, index) => (
                            <blockquote key={index} className="text-lg font-serif italic text-[#1A2A40] border-l-4 border-[#4A7C59] pl-6 py-2">
                              {'“'}
                              {quote}
                              {'”'}
                            </blockquote>
                          ))}
                        </div>
                        <p className="text-lg text-[#1A2A40] leading-relaxed">
                          {slide.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="px-6">
              <div className="flex justify-center gap-2 mt-8">
                {carouselSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide ? 'w-8 bg-[#4A7C59]' : 'w-2 bg-[#D4CFC4]'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Private Life - Split Section */}
        <section className="w-full bg-[#E8E4DC] py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
              
              {/* Left Column (2/3): In Her Own Words - OVERLAP LAYOUT */}
              <div className="w-full lg:w-2/3 space-y-8">
                <h3 className="text-3xl font-serif font-bold text-[#1A2A40] mb-8 border-b border-[#1A2A40]/10 pb-4">
                  In Her Own Words
                </h3>
                
                {/* The Overlap Container */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start">
                  
                  {/* 1. The Image (Base Layer) */}
                  <div className="w-full md:w-5/12 shrink-0 z-0 relative">
                    <div className="aspect-3/4 bg-[#1A2A40] rounded-sm overflow-hidden shadow-lg filter sepia-[0.2]">
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
{/* 2. The Quote Card (Top Layer) - Overlapping */}
<div className="w-full md:w-8/12 z-10 -mt-8 md:mt-12 md:-ml-16">
  {/* FIXED: Changed bg from dark to light (#F5F0E8) */}
  <div className="relative bg-[#F5F0E8] rounded-sm p-8 md:p-10 shadow-xl border-l-4 border-[#1A2A40]">
    
    {/* FIXED: Changed quote mark color to be subtle on light bg */}
    <div className="absolute top-4 right-6 text-9xl font-serif text-[#1A2A40]/5 leading-none pointer-events-none">
      ”
    </div>

    <div className="relative z-10 space-y-6 min-h-[220px] flex flex-col justify-center">
      {/* The "Lens" Label */}
      <div className="flex items-center gap-3 mb-2">
         <span className="h-[1px] w-8 bg-[#8B4513]"></span>
         {/* FIXED: Ensure label text is a readable color */}
         <p className="text-xs font-bold text-[#8B4513] uppercase tracking-[0.2em]">
           {handwrittenQuotes[currentQuote].category}
         </p>
      </div>

      {/* FIXED: Changed quote text color to dark (#1A2A40) for high contrast */}
      <p className="text-xl md:text-2xl font-serif text-[#1A2A40] leading-relaxed">
        {handwrittenQuotes[currentQuote].quote}
      </p>
    </div>
    
    {/* Navigation Controls */}
    {/* FIXED: Changed border color to be visible on light bg */}
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#1A2A40]/10">
      <div className="flex gap-1.5">
        {handwrittenQuotes.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuote(index)} 
            /* FIXED: Updated dot colors for light background */
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentQuote ? 'w-8 bg-[#1A2A40]' : 'w-1.5 bg-[#1A2A40]/20 hover:bg-[#1A2A40]/40'
            }`}
            aria-label={`Go to quote ${index + 1}`}
          />
        ))}
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={prevQuote}
          /* FIXED: Updated arrow button colors for light background */
          className="p-2 text-[#1A2A40] hover:bg-[#1A2A40]/5 rounded-full transition-colors border border-[#1A2A40]/20"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={nextQuote}
          /* FIXED: Updated arrow button colors for light background */
          className="p-2 text-[#1A2A40] hover:bg-[#1A2A40]/5 rounded-full transition-colors border border-[#1A2A40]/20"
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
              <div className="w-full lg:w-1/3 border-l border-[#1A2A40]/10 lg:pl-12 space-y-8">
                <div>
                    <h3 className="text-xl font-serif font-bold text-[#1A2A40] mb-2">
                      A Day in the Life
                    </h3>
                    <p className="text-xs text-[#5A6472] uppercase tracking-wider mb-6">
                      1912–1915 • Based on Asquith's Poem
                    </p>
                </div>

                <div className="space-y-0 relative">
                    {/* Continuous Vertical Timeline Line */}
                    <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-[#1A2A40]/10 z-0"></div>

                    {dailySchedule.map((item, index) => (
                      <div key={index} className="flex gap-5 items-start relative z-10 pb-8 last:pb-0">
                        {/* Roman Numeral Circle */}
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#E8E4DC] border-2 border-[#1A2A40] text-[#1A2A40] font-serif text-xs font-bold shadow-sm z-10">
                          {item.marker} 
                        </span>
                        
                        {/* Content */}
                        <div className="pt-1">
                          <p className="font-bold text-[#1A2A40] text-sm uppercase tracking-wide mb-1">
                            {item.time}
                          </p>
                          <p className="text-[#1A2A40] font-serif text-lg italic leading-snug">
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
        <section className="w-full bg-[#E8E4DC] py-20 border-t border-[#1A2A40]/10">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="mb-16 text-center">
              <h3 className="text-4xl font-serif font-bold text-[#1A2A40] mb-3">Intellect & Vice</h3>
              <p className="text-[#5A6472] font-serif italic text-lg">"A whetted appetite and zest for the pleasures of the world"</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
              
              {/* LEFT COL: The Bookshelf (Upgraded) */}
              <div className="w-full lg:w-1/2 space-y-8">
                <h3 className="text-2xl font-serif font-semibold text-[#1A2A40] pl-4 border-l-4 border-[#1A2A40]">
                  The Bookshelf
                </h3>

                {/* The "Library Card" Container */}
                <div className="bg-[#F5F0E8] rounded-sm shadow-sm border border-[#D4CFC4] overflow-hidden">
                  
                  {/* THE IMAGE HEADER */}
                  {/* We use h-64 to give it significant visual weight to match the Hobbies column */}
                  <div className="relative h-64 w-full border-b border-[#1A2A40]/10">
                    <div className="absolute inset-0 bg-[#1A2A40]/10 mix-blend-multiply z-10" /> {/* Slight dimming for atmosphere */}
                    {/* Replace with your actual file path */}
                    <img 
                      src="/venetia-page/venetia_bookshelf.jpg" 
                      alt="Edwardian Bookshelf"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Optional: "Library" Label Overlay */}
                    <div className="absolute bottom-4 left-6 z-20">
                      <span className="bg-[#F5F0E8] text-[#1A2A40] px-3 py-1 text-xs font-bold uppercase tracking-widest border border-[#1A2A40]/20 shadow-sm">
                        Venetia's Library
                      </span>
                    </div>
                  </div>

                  {/* The List Content */}
                  <div className="p-8 space-y-8 relative">
                    {/* Background decorative watermark (kept subtle) */}
                    <div className="absolute top-10 right-0 text-[10rem] font-serif text-[#1A2A40]/5 leading-none pointer-events-none -mr-4">
                      &
                    </div>

                    {/* Category 1: Russian Lit */}
                    <div className="group border-b border-[#1A2A40]/10 pb-6 last:border-0 relative z-10">
                      <p className="text-xs font-bold text-[#8B4513] uppercase tracking-widest mb-1">Heavy Reading</p>
                      <h4 className="text-xl font-serif font-bold text-[#1A2A40] mb-2">
                        Russian Literature
                      </h4>
                      <p className="text-[#3A4A5A] font-serif italic mb-2">
                        "The Brothers Karamazov" & "Crime & Punishment"
                      </p>
                      <p className="text-xs text-[#5A6472] leading-relaxed">
                        She read Dostoevsky obsessively in 1914, finding his chaotic morality a mirror for her own life.
                      </p>
                    </div>

                    {/* Category 2: The Classics */}
                    <div className="group border-b border-[#1A2A40]/10 pb-6 last:border-0 relative z-10">
                      <p className="text-xs font-bold text-[#8B4513] uppercase tracking-widest mb-1">The Foundation</p>
                      <h4 className="text-xl font-serif font-bold text-[#1A2A40] mb-2">
                        Greek & Roman Classics
                      </h4>
                      <p className="text-[#3A4A5A] font-serif italic mb-2">
                        "Winchester Troopers" (Dialogue) — "Great fun"
                      </p>
                      <p className="text-xs text-[#5A6472] leading-relaxed">
                          Educated far beyond the standard for women of her time, she could debate Asquith on nuances of Greek translation.
                      </p>
                    </div>

                      {/* Category 3: Poetry */}
                      <div className="group pb-2 last:border-0 relative z-10">
                      <p className="text-xs font-bold text-[#8B4513] uppercase tracking-widest mb-1">Verse</p>
                      <h4 className="text-xl font-serif font-bold text-[#1A2A40] mb-2">
                        Dante & The Moderns
                      </h4>
                      <p className="text-[#3A4A5A] font-serif italic mb-2">
                        "The Divine Comedy (Inferno)"
                      </p>
                      <p className="text-xs text-[#5A6472] leading-relaxed">
                          Read aloud, translating horrors "with great gusto" to anyone who would listen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>


              {/* RIGHT COL: Hobbies (Existing - just ensuring height matches) */}
              <div className="w-full lg:w-1/2 space-y-8">
                <h3 className="text-2xl font-serif font-semibold text-[#1A2A40] pl-4 border-l-4 border-[#1A2A40]">
                  Hobbies
                </h3>
                
                <div className="grid gap-8">
                  {hobbies.map((hobby, index) => (
                    <div 
                      key={index} 
                      className="group flex flex-col sm:flex-row bg-[#F5F0E8] rounded-sm border border-[#D4CFC4] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                    >
                      {/* Image (Left on desktop) */}
                      <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden bg-[#1A2A40]">
                        <div className="absolute inset-0 bg-[#1A2A40]/20 group-hover:bg-transparent transition-all z-10" />
                        <img 
                          src={hobby.image} 
                          alt={hobby.title}
                          className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        />
                      </div>

                      {/* Text (Right) */}
                      <div className="sm:w-3/5 p-6 flex flex-col justify-center relative">
                        {/* Diamond Notch */}
                        <div className="hidden sm:block absolute left-0 top-1/2 -translate-x-1/2 w-4 h-4 bg-[#F5F0E8] rotate-45 border-l border-b border-[#D4CFC4] z-20"></div>
                        
                        <h4 className="text-xl font-serif font-bold text-[#1A2A40] mb-2">
                          {hobby.title}
                        </h4>
                        <p className="text-[#3A4A5A] text-sm leading-relaxed font-serif italic">
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
      <footer className="w-full bg-[#050505] py-20 border-t border-white/10 relative overflow-hidden">
        
        {/* Optional: Background Noise Texture for Film Grain effect */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          {/* LEFT COLUMN: The Narrative Context */}
          <div className="w-full md:w-1/2 space-y-6 text-center md:text-left z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#F5F0E8] mb-4">
                The Survivor
              </h2>
              <div className="w-24 h-[1px] bg-[#8B4513] opacity-80 mx-auto md:mx-0"></div>
            </div>
            
            <div className="space-y-4">
              <p className="text-lg md:text-xl text-[#E8E4DC] font-normal leading-relaxed">
                H.H. Asquith destroyed nearly all her letters. The &quot;Venetia&quot; we know is mostly constructed from his obsession.
              </p>              
              <p className="text-xl text-[#F5F0E8] font-serif italic leading-relaxed">
                But one rare glimpse remains.
              </p>

              <p className="text-sm md:text-base text-gray-300 font-medium leading-relaxed max-w-md mx-auto md:mx-0 border-l-2 border-[#8B4513] pl-4">
                This archival footage from 1928 captures Venetia at Alderley Edge,
                playing bridge with her mother. It is a silent testament to the
                woman who outlived the scandal to find her own quiet, sharp-
                witted peace.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: The Video Link Card */}
{/* RIGHT COLUMN: The Video Link Card */}
    <div className="w-full md:w-1/2 z-10 flex justify-center md:justify-end">
      <a 
        href="https://www.bridgemanimages.com/en/noartistknown/venetia-montagu-and-dowager-lady-stanley-of-alderley-playing-bridge/footage/asset/486980"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-full max-w-lg aspect-video bg-[#0A0A0A] rounded-sm overflow-hidden shadow-2xl border border-white/10 hover:border-[#8B4513]/50 transition-all duration-500"
      >
        {/* 1. The Generic "Silent Film" Background (CSS Only) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#151515]">
          
          {/* Film Grain Texture */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
          </div>
          
          {/* Vintage Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_120%)] opacity-80"></div>

          {/* The "Title Card" Text */}
          <div className="z-10 text-center space-y-2 opacity-60 group-hover:opacity-40 transition-opacity duration-500">
             <p className="text-[#F5F0E8] font-serif text-3xl md:text-4xl tracking-[0.2em] font-bold">
               ARCHIVE
             </p>
             <div className="w-12 h-[1px] bg-[#F5F0E8] mx-auto"></div>
             <p className="text-[#F5F0E8] font-mono text-sm tracking-widest uppercase">
               Alderley Edge, 1928
             </p>
          </div>
        </div>

        {/* 2. The Play Button Overlay (Same as before) */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#F5F0E8]/5 backdrop-blur-sm border border-[#F5F0E8]/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#F5F0E8]/10 transition-all duration-300 shadow-2xl">
            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-[#F5F0E8] border-b-[10px] border-b-transparent ml-1 opacity-80 group-hover:opacity-100"></div>
          </div>
        </div>

        {/* 3. The Source Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md px-4 py-3 flex justify-between items-center border-t border-white/5 z-30">
           <span className="text-xs text-[#E8E4DC] font-bold uppercase tracking-wider flex items-center gap-2">
             Watch Footage <span className="text-[#8B4513]">↗</span>
           </span>
           <span className="text-[10px] text-[#5A6472]">
             Source: Bridgeman Images
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
