import { sources } from "next/dist/compiled/webpack/webpack";

export const TIMELINE_DATA = [
  {
    id: "jan-03",
    date: "1914-01-03",
    displayDate: "January 3rd, 1914",
    location: "Alderley Park, Cheshire",
    coords: [53.286, -2.234], // Real Lat/Lng
    diaryEntry:
      "Managed to scribble a hasty pencil note to H. this morning before the chaos descended. I feel as if I am doubling the parts of Martha and Granville Barker here—managing the house and the entertainment all at once. The 'Constitutional Crisis' over Ireland follows him even here; he sat for hours writing about the Ulster exclusion, his face grey with the boredom of it. I disappeared early the other night just to breathe. Cys is doing better; the doctor says he need only telegraph on alternate days now. Oh, to be abroad with H. again, away from all this performance—though sometimes I wonder if it is the performance he loves, or me.",
    historicalFacts: [
      "Sent Asquith a 'little pencil note' in the morning",
      "Described herself as 'doubling the parts of Martha & Granville Barker'",
      "Suggested traveling abroad with Asquith",
      "Provided updates on 'Cys' and the doctor's telegraph schedule",
    ],
    sources: [
      "Reconstruction from Asquith's letter to Venetia (Jan 5, 1914)"
    ],
    visualBackground: "/timeline/Alderley_Park_Paint_Winter.jpg",
    visualAlt: "Alderley Park painting with an overlay of people playing cards",
    theme: "winter",
  },
    {
      id: "jan-06",
      date: "1914-01-06",
      displayDate: "January 6th, 1914",
      location: "Chamonix, France",
      coords: [51.5074, -0.1278], // London
      destination: [45.923, 6.869], // Chamonix
      diaryEntry:
        "I am utterly mewed up in this beastly far-away inn. Oliver is here, of course, but the charm of Chamonix is lost on me today; I feel rusty and bored. My mind wanders back to Sicily—the warmth, the light—so different from this frozen isolation. I have sent H. a long account of our existence here, though I fear he will find it dreadfully dull compared to the Cabinet cabals he describes so vividly. He writes that the Unionists are becoming 'reckless gamblers' over Home Rule. I must remember to forward those addresses he asked for; even here, the 'Enchantress' and travel plans seem the only things worth discussing.",
      historicalFacts: [
        "Wrote a long letter to Asquith dated the 6th",
        "Described staying in a 'beastly far-away inn' (Chamonix)",
        "Traveled abroad with her brother, Oliver",
        "Reminisced about previous travel to Sicily",
        "Provided addresses and discussed future travel on the 'Enchantress'",
      ],
      sources: [
        "Reconstruction from Asquith's letter (Jan 9, 1914)"
      ],
      visualBackground: "/timeline/Chamonix_Paint_Winter.jpg",
      visualAlt: "Snowy landscape in Chamonix",
      theme: "winter",
    },
  {
    id: "feb-05",
    date: "1914-02-05",
    displayDate: "February 5th, 1914",
    location: "Tilstone Lodge, Tarporley, Cheshire",
    coords: [53.123, -2.635], // Real Lat/Lng
    diaryEntry:
      "Down at Tilstone Lodge for the hunting. The mud is frightful but the run was glorious—real fun. H. mocks my 'calls and cares,' but he is quite right—this life is its own little tyranny. Mother sent a hilarious cutting claiming H.'s visits to Alderley are motivated by the 'Non-conformist grievance in single-school areas'! I sent it on to him; he needs the laugh, with the King so agitated about the Army and Ulster. Also wrote to Edwin—it is his birthday tomorrow. I must pin him down for dinner Sunday; his cynicism is sometimes a relief after H.'s intense devotion.",
    historicalFacts: [
      "Went hunting from Tilstone Lodge, Tarporley",
      "Admitted to Asquith that his account of her social 'calls & cares' was accurate",
      "Sent Asquith a newspaper cutting claiming his visits were for 'Non-conformist grievances'",
      "Wrote to Edwin Montagu for his birthday and invited him to dine",
      "Planned to return to London on Saturday night",
    ],
    sources: [
      "Reconstruction from Asquith's letter (Feb 6, 1914)",
      "Venetia Stanley to Edwin Montagu letter (Feb 5, 1914)"
    ],
    visualBackground: "/timeline/Tilstone_Lodge_Paint.jpg",
    visualAlt: "Tilstone Lodge, Tarporley, Cheshire",
    theme: "winter",
  },
  {
    id: "feb-24",
    date: "1914-02-24",
    displayDate: "February 24th, 1914",
    location: "Pembroke Dock, Wales",
    coords: [51.683, -4.933],
    diaryEntry:
      "A day of salt air and speeches. I stood on the platform at Pembroke and smashed the bottle against the hull of the Cordelia. She slid into the water beautifully—a 'successful launch,' as the papers will say. The Captain-Superintendent was very kind, though Sir Charles Phillips went on rather long. I am exhausted by the formality. It will be a relief to get back to London; after all this pomp, I find myself missing H.'s conversation. He is the only one who would find the absurdity in Sir Charles's speech, though his letters lately are full of worry about the War Office’s competence. I worry he relies too much on my letters to keep his spirits up.",
    historicalFacts: [
      "Performed the naming ceremony for the light cruiser CORDELLA",
      "Successfully launched the ship at Pembroke Dockyard in the afternoon",
      "Attended by the Captain-Superintendent, Mrs. Grant, and Sir Charles Phillips",
      "Likely the 'journey' previously mentioned as postponed to Monday",
    ],
    sources: [
      "The Times, February 24, 1914"
    ],
    visualBackground: "/timeline/Cordelia_Paint.jpg",
    visualAlt: "Cordelia ship naming ceremony at Pembroke Dock",
    theme: "winter",
  },
  {
    id: "mar-03",
    date: "1914-03-03",
    displayDate: "March 3rd, 1914",
    location: "Admiralty House, London",
    coords: [51.5035, -0.1276], // Near Downing Street
    diaryEntry:
      "Lunched at Winston’s today. He was in full flow, treating the soup tureen as if it were a dispatch box. Afterwards, The Bud dragged me round the shops—an endless parade of hats and dresses I have no patience for. We laughed ourselves sick later discussing the 'Great Opium Plot'—the idea of stuffing Raymond’s pipes with opium to quiet him down. I suspect H. thinks I am actually guilty of it. If only life were that exciting.",
    historicalFacts: [
      "Lunched at Winston Churchill's",
      "Went shopping for hats and dresses with 'The Bud'",
      "Discussed the joke about putting opium in Raymond Asquith's pipes",
    ],
    sources: [
      "Reconstruction from Asquith's letter (Mar 4, 1914)."
    ],
    visualBackground: "/timeline/london_shop_paint.jpg",
    visualPrompt:
      "Edwardian London milliner shop interior, 1914, piles of elaborate hats with feathers and ribbons, soft afternoon light filtering through a shop window, impressionistic style, slightly chaotic but luxurious.",
    visualAlt: "A chaotic display of hats at a London milliner's",
    theme: "social",
  },
  {
    id: "mar-18",
    date: "1914-03-18",
    displayDate: "March 18th, 1914",
    location: "Mansfield 18, London",
    coords: [51.519689936407765, -0.14560590552324795],
    diaryEntry:
      "H. wrote this morning—a note that I read three times. He called it 'delicious having you last night,' even if, as he admitted, the conditions might have been better. A stolen hour in the closed motor, cramped and rattling through the rain, is hardly the luxury of The Wharf. Yet, in the dark, with the Army mutiny at the Curragh threatening to pull the Government down, the closeness is all that matters to him. He holds my hand as if it is the only steady thing in London. I sometimes fear I am not strong enough to hold up the Prime Minister of England.",
    historicalFacts: [
      "Spent the night with Asquith",
      "Asquith described the time as 'delicious'",
    ],
    sources: [
      "Reconstruction from Asquith's letter (Mar 19, 1914)"
    ],
    visualBackground: "/timeline/Mansfield_Paint.jpg",
    visualPrompt:
      "Dimly lit Edwardian drawing room at night, close up on a small table with two crystal brandy glasses and an open book, warm fireplace glow in background, intimate and quiet atmosphere, oil painting style.",
    visualAlt: "Mansfield 18 from the outside",
    theme: "intimate",
  },
  {
    id: "mar-29",
    date: "1914-03-29",
    displayDate: "March 29th, 1914",
    location: "The Wharf, Sutton Courtenay",
    coords: [51.6444, -1.275],
    diaryEntry:
      "A relentlessly wet, dreary Sunday at The Wharf. We had intended to golf, but the sky opened up and drowned the links. Instead, we bundled into the closed motor and drove through the grey countryside. Seely has resigned, and H. talks of taking the War Office himself—a bold, Napoleonic stroke. He seems reinvigorated by the decision, while I feel only the crushing weight of it on him. There is something strangely comforting about being sealed inside the car with him, safe from the mud and the politics, but his need for me is becoming terrifyingly absolute.",
    historicalFacts: [
      "Stayed at The Wharf, Sutton Courtenay",
      "Golf cancelled due to wet weather",
      "Went for a drive in the closed motor with Asquith",
    ],
    sources: [
      "Reconstruction from Asquith's letter (Mar 30, 1914)."
    ],
    visualBackground: "/timeline/The_Wharf_Paint.jpg",
    visualPrompt:
      "View from inside a vintage 1914 luxury car looking out, rain droplets on the glass window, blurry green English countryside passing by outside, leather interior texture, moody grey lighting, cinematic.",
    visualAlt: "Rain streaking the window of a motor car",
    theme: "winter",
  },
  {
    id: "apr-07",
    date: "1914-04-07",
    displayDate: "April 7th, 1914",
    location: "Mansfield 18, London",
    coords: [51.519689936407765, -0.14560590552324795],
    diaryEntry:
      "Tomorrow our little group scatters, and I cannot say I am entirely sorry. The air has been thick with drama. A hysterical letter arrived regarding 'G.R.'—the contents were so disturbing I had to share them with H. immediately. It is exhausting, managing these fragile male egos while trying to pack trunks. I shall be glad of the quiet when the separation finally comes.",
    historicalFacts: [
      "Preparing to separate from her social group the next day",
      "Discussed a disturbing/hysterical letter involving 'G.R.' with Asquith",
    ],
    sources: ["Reconstruction from Asquith's letter (Apr 8, 1914)"],
    visualBackground: "/timeline/1914-04-07.jpg",
    visualPrompt:
      "Interior of an Edwardian bedroom, 1914, open steamer trunks with silk dresses spilling out, a crumpled letter resting on a vanity table in the foreground, soft natural light, atmospheric and slightly chaotic.",
    visualAlt: "Open travel trunks and a crumpled letter on a table",
    theme: "social",
  },
  {
    id: "apr-17",
    date: "1914-04-17",
    displayDate: "April 17th, 1914",
    location: "Littlestone, Kent",
    coords: [50.985, 0.965], // Coastal location
    diaryEntry:
      "I stayed down here rather than rushing up to London yesterday. The sea air gave me a burst of courage—I have cut a fringe! It is quite an 'adventurous coiffure,' though I wonder if H. will approve or just stare at me in that puzzled way of his. The news from Ulster is black—gun-running suspected everywhere—and he writes of 'grave decisions.' I wrote him two letters today to make up for my absence. It is strange how one can feel closer to someone when miles apart than when sitting across a crowded dinner table.",
    historicalFacts: [
      "Stayed away at Littlestone instead of going to London",
      "Wrote two letters to Asquith on this day",
      "Adopted a new hairstyle (wearing a fringe)",
    ],
    sources: ["Reconstruction from Asquith's letter (Apr 18, 1914)."],
    visualBackground: "/timeline/Kent_Paint.jpg",
    visualPrompt:
      "View of a calm English seaside at Littlestone, 1914, looking out from a window with white lace curtains blowing in the breeze, a silver hand-mirror and scissors on the windowsill, soft coastal light.",
    visualAlt: "A hand mirror and scissors by a window overlooking the sea",
    theme: "intimate",
  },
  {
    id: "may-01",
    date: "1914-05-01",
    displayDate: "May 1st, 1914",
    location: "Mansfield 18, London",
    coords: [51.5074, -0.1278],
    diaryEntry:
      "I have put off my journey. The trunks were packed, but I could not bring myself to leave London just yet. I stayed to write to him—not as the Prime Minister, but as 'Doggo' and 'Dusty,' those foolish, secret names we have invented. The Tories are howling about the Ulster gun-running, calling the Government helpless. It feels like we are building a private fortress with words, invisible to everyone else. The city is noisy tonight, but I feel perfectly calm knowing I am still within his reach. Is this devotion, or just a habit I cannot break?",
    historicalFacts: [
      "Postponed her journey to stay in town (London)",
      "Wrote a letter using playful pet names like 'Doggo' and 'Dusty'",
    ],
    sources: ["Reconstruction from Asquith's letter (May 1, 1914)."],
    visualBackground: "/timeline/1914-05-01.jpg",
    visualPrompt:
      "Close up of an elegant Edwardian writing desk, 1914, a fountain pen resting on cream stationery, hand-written text visible but blurry, warm lamplight illuminating the desk while the background is in shadow.",
    visualAlt: "A letter being written on a desk in London",
    theme: "intimate",
  },
  {
    id: "may-28",
    date: "1914-05-28",
    displayDate: "May 28th, 1914",
    location: "Penrhos, Anglesey",
    coords: [53.3, -4.61], // Near Holyhead Golf Club
    diaryEntry:
      "A round of golf on the Holyhead links this afternoon. It was a 'threesome'—myself, H., and Hockey, the local professional. H. played well, though the wind off the Irish Sea is unforgiving. It is strange to see reporters watching from the edge of the course, scribbling down our scores. They call it 'The Premier's Holiday,' but the Home Rule Bill passed the Commons yesterday, and the strain shows in his eyes. To me, it is just a walk on the grass with a friend, trying to ignore the coming drizzle and the inevitable return to Westminster.",
    historicalFacts: [
      "Played a 'threesome' of golf with Asquith and Hockey (the pro)",
      "Staying at Penrhos, Lord Sheffield's seat",
      "Newspaper reporters were present to document the game",
    ],
    sources: ["Reconstruction from Asquith's letter (May 29, 1914)", "Liverpool Echo, 30 May, 1914"],
    visualBackground: "/timeline/1914-05-28.jpg",
    visualPrompt:
      "Vintage 1914 style view of a golf course on the coast of Wales (Holyhead), overcast sky, three figures in period golf attire (long skirts, tweed jackets) walking on the green, sea visible in the distance, grainy texture.",
    visualAlt: "Golfers on the Holyhead links under a grey sky",
    theme: "social",
  },
  {
    id: "jun-17",
    date: "1914-06-17",
    displayDate: "June 17th, 1914",
    location: "Ascot Racecourse, Berkshire",
    coords: [51.413, -0.676],
    diaryEntry:
      "Ascot for the Hunt Cup today. The weather was perfect—one of those rare English summer days where the light flatters everyone. I walked the paddock with Diana; we saw Winston there, looking restless as usual—probably plotting something about the Amending Bill. The Duchess of Newcastle was in a peacock blue charmeuse that demanded attention. After hours of bobbing to the Royal Box and discussing odds, I was desperate to escape. I motored back to London to see H. tonight; he says my letters are his 'daily bread,' a phrase that makes me feel both proud and trapped.",
    historicalFacts: [
      "Attended Hunt Cup Day at Ascot (weather reported as 'perfect')",
      "Saw Lady Diana Manners and Winston Churchill, who were present",
      "Noted the Duchess of Newcastle's 'peacock blue charmeuse' gown",
      "Returned to London to meet Asquith that night",
    ],
    sources: ["Reconstruction from Asquith's letter (Jun 18, 1914).", "The Times, June 18, 1914"],
    visualBackground: "/timeline/Ascot_Paint.jpg",
    visualPrompt:
      "Edwardian crowd scene at Ascot Racecourse 1914, sunny day, women in large hats and white dresses with parasols walking on the green grass, men in top hats, impressionistic style capturing the dappled sunlight.",
    visualAlt: "Elegant crowd on the lawns at Ascot",
    theme: "social",
  },
  {
    id: "jun-24",
    date: "1914-06-24",
    displayDate: "June 24th, 1914",
    location: "Royal Opera House, Covent Garden",
    coords: [51.5129, -0.1222],
    diaryEntry:
      "Covent Garden for the Strauss tonight. The music is so thick and complex, it batters against your senses. My head is still spinning from it—or perhaps from the lack of sleep. It was a relief to see H. yesterday without the shadow of politics hanging over us for once. Just two people talking. Tonight, amidst the crashing chords and the diamond tiaras, that quiet hour seems infinitely more precious.",
    historicalFacts: [
      "Attended the Opera (Strauss) at Covent Garden",
      "Met Asquith the previous day for a non-political meeting",
      "Expected at the Speyers' that evening",
    ],
    sources: ["Reconstruction from Asquith's letter (Jun 25, 1914)."],
    visualBackground: "/timeline/Opera_Paint.jpg",
    visualPrompt:
      "View from a box at the Royal Opera House 1914, looking down at the illuminated stage and the dark velvety audience, red velvet curtains in foreground, opera glasses resting on the ledge.",
    visualAlt: "View from an opera box at Covent Garden",
    theme: "social",
  },
  {
    id: "jul-10",
    date: "1914-07-10",
    displayDate: "July 10th, 1914",
    location: "Albert Hall, Dundee",
    coords: [56.462, -2.97],
    diaryEntry:
      "Dundee has gone mad with 'wild enthusiasm' for the King and Queen. I went to the Albert Hall with Clemmie, who looked lovely in black and pink roses. I wore my creme yellow tussore silk—the one striped with blue—and a hat wreathed in roses. We sat through the anthems and the presentations; the Queen looked splendid but pale. It is all a great show of loyalty, but after days on the Enchantress, the noise is deafening. I found myself watching the crowd more than the dais—people are so easily enchanted.",
    historicalFacts: [
      "Attended the Royal reception at Albert Hall, Dundee with Mrs. Churchill (Tims, July 10th. 1914)",
      "Wore a 'creme yellow tussore silk gown, striped with blue' and a hat with roses",
      "Noted the 'wild enthusiasm' of the crowd and the Queen's 'splendid but pale' appearance",
    ],
    sources: ["Dundee Evenning Telegraph, 10 July, 1914", "Reconstruction from Asquith's letter (Jul 11, 1914)."],
    visualBackground: "/timeline/venetia_dressed_10_7_1914.jpg",
    visualPrompt:
      "Interior of Albert Hall Dundee 1914, royal reception, crowded with dignitaries, focus on two elegant women in foreground (one in yellow striped silk, one in black with pink roses), flags and bunting, soft indoor lighting.",
    visualAlt: "Venetia and Clementine at the Royal Reception in Dundee",
    theme: "social",
  },
  {
    id: "jul-28",
    date: "1914-07-28",
    displayDate: "July 28th, 1914",
    location: "Penrhos, Anglesey",
    coords: [53.3, -4.61],
    diaryEntry:
      "I am sitting on the rocks, staring at the grey sea. It feels a million miles from the madness in London, yet H.'s letters bring the panic right to my feet. Austria has declared war on Serbia. This war... it seems like such a disproportionate remedy. As I told H., it is like cutting off one’s head to get rid of a headache. He writes so faithfully, even now, with the world crumbling. I try to send him the peace of this place, but I fear the headache is going to kill us all.",
    historicalFacts: [
      "Wrote to Asquith from 'the rocks' at Penrhos",
      "Compared the coming war to 'cutting off one's head to get rid of a headache'",
      "Praised Asquith as a good correspondent",
    ],
    sources: ["Reconstruction from Asquith's letter (Jul 29, 1914)."],
    visualBackground: "/timeline/Penrhos_Paint.jpg",
    visualPrompt:
      "A solitary woman in a white Edwardian dress sitting on rugged grey seaside rocks, looking out at a turbulent Irish Sea, overcast sky, moody and contemplative, oil painting style.",
    visualAlt: "Sitting on the rocks at Penrhos looking out to sea",
    theme: "summer",
  },
  {
    id: "jul-30",
    date: "1914-07-30",
    displayDate: "July 30th, 1914",
    location: "Penrhos, Anglesey",
    coords: [53.3, -4.61],
    diaryEntry:
      "I put on my new striped dress today—it hangs rather well, I think. I wrote to H. and told him I shall be really disappointed if he does not come down to us. It seems absurd to worry about visits and frocks when the armies are mobilizing, but one clings to the normal things. I am waiting for the post, waiting for him, waiting for the world to decide if it is going to end.",
    historicalFacts: [
      "Wrote to Asquith mentioning her new striped dress",
      "Told Asquith she would be 'really disappointed' if he did not visit",
    ],
    sources: ["Reconstruction from Asquith's letter (Jul 31, 1914)."],
    visualBackground: "/timeline/1914-07-30.jpg",
    visualPrompt:
      "Interior view of an Edwardian country house bedroom, a woman in a striped dress standing by a window looking out at a rain-swept garden, reflection in the glass, sense of waiting and anxiety.",
    visualAlt: "Waiting by the window at Penrhos",
    theme: "intimate",
  },
  {
    id: "aug-04",
    date: "1914-08-04",
    displayDate: "August 4th, 1914",
    location: "Penrhos, Anglesey",
    coords: [53.295, -4.608],
    diaryEntry:
      "The clock ticks towards midnight and the expiration of the ultimatum. I feel a terrible restlessness. We moved the tent today, dragging canvas across the grass as if preparing for our own little campaign. I read H.'s letters to the family—carefully editing, of course. They listen for news of the war; I look for news of the man. He sounds like a man facing the end of his world. I had planned to go to Lulworth, but everything is suspended now. We are all just waiting for the catastrophe.",
    historicalFacts: [
      "Moved her tent from Penrhos",
      "Read letters to her family",
      "Planned travel to Lulworth (which was uncertain/cancelled)",
    ],
    sources: ["Reconstruction from Asquith's letter (Aug 5, 1914)."],
    visualBackground: "/timeline/1914-08-04.jpg",
    visualPrompt:
      "A white canvas tent pitched on a grassy lawn at twilight in 1914, shadows lengthening, a large country house visible in the distance with lights glowing in the windows, ominous moody sky.",
    visualAlt: "A tent pitched on the grounds of Penrhos at twilight",
    theme: "war",
  },
  {
    id: "aug-14",
    date: "1914-08-14",
    displayDate: "August 14th, 1914",
    location: "Mansfield 18, London",
    coords: [51.519689936407765, -0.14560590552324795],
    diaryEntry:
     "Sent H. a sprig of myrtle today. I wonder if he knows it is the emblem of love? It seemed the only soft thing in a hard world, with the B.E.F. landing in France and silence falling over the wires. To distract myself, I have buried my head in Pope's 'Dunciad'—satire feels safer than reality right now. The Assyrian is here, grousing away about his own importance and the Cabinet reshuffle. I listen, but my thoughts are entirely with the Prime Minister's speech. Edwin is a refuge, but H. is the storm.",
    historicalFacts: [
      "Sent Asquith a sprig of myrtle",
      "Was reading Pope's 'Dunciad'",
      "Dealing with 'the Assyrian' (Edwin Montagu) who was complaining/grousing",
    ],
    sources: ["Reconstruction from Asquith's letter (Aug 15, 1914)."],
    visualBackground: "/timeline/1914-08-14.jpg",
    visualPrompt:
      "Still life 1914 style: an open leather-bound book (Pope's Dunciad) on a table, a fresh sprig of green myrtle resting on the page, and a handwritten envelope addressed to the Prime Minister nearby.",
    visualAlt: "A sprig of myrtle on an open book",
    theme: "intimate",
  },
  {
    id: "aug-18",
    date: "1914-08-18",
    displayDate: "August 18th, 1914",
    location: "Penrhos, Anglesey",
    coords: [53.295, -4.608],
    diaryEntry:
      "A long, exhausting day in the motor getting back here. The rhythm of the road makes one think... My mind keeps going back to Saturday in London, and that moment in Roehampton Lane. I had to get rid of that 'flimsy'—the secret note. I crumpled it up and threw it right out of the window into the hedge. I suppose it is rotting there now, a piece of state secrecy turning into pulp in the rain. A dangerous game we play.",
    historicalFacts: [
      "Spent the day travelling in the motor",
      "Recalled throwing away a secret note in Roehampton Lane on the previous Saturday",
      "Wrote to Asquith from Penrhos",
    ],
    sources: ["Reconstruction from Asquith's letter (Aug 19, 1914)."],
    visualBackground: "/timeline/1914-08-18.jpg",
    visualPrompt:
      "View from inside a moving 1914 motor car, looking out the open window at a blurred English country lane (Roehampton), a crumpled piece of white paper flying out of the window into the green hedgerow, sense of motion.",
    visualAlt: "A secret note being thrown from a car window",
    theme: "secret",
  },
  {
    id: "sep-12",
    date: "1914-09-12",
    displayDate: "September 12th, 1914",
    location: "Mells Manor, Somerset",
    coords: [51.24, -2.39],
    diaryEntry:
      "Arrived at Mells with Bluey. It feels like a sanctuary here, stone walls shutting out the war. I gave H. his birthday presents today—a sombre portrait and the copy of Keats. He seemed touched. We sat for a while in the quiet; words are becoming difficult, so we let the poetry speak for us. It was a 'vigil dinner' tonight—waiting, always waiting, for news from the front.",
    historicalFacts: [
      "Travelled to Mells with 'Bluey'",
      "Gave Asquith birthday presents, including a copy of Keats",
      "Attended a 'vigil dinner' at Mells",
    ],
    sources: ["Reconstruction from Asquith's letter (Sep 13, 1914)."],
    visualBackground: "/timeline/Mells_Manor_Paint.jpg",
    visualPrompt:
      "Interior of an ancient English manor library (Mells), 1914, leather-bound books, a copy of Keats lying open on a heavy oak table, soft candlelight, atmosphere of quiet melancholy.",
    visualAlt: "A copy of Keats on a table at Mells Manor",
    theme: "intimate",
  },
  {
    id: "sep-16",
    date: "1914-09-16",
    displayDate: "September 16th, 1914",
    location: "Travelling to Penrhos",
    coords: [51.499, -0.124], // London
    destination: [53.291, -4.615], // Penrhos
    diaryEntry:
      "Poor Percy is gone. I feel it acutely—the first of us to fall. I wrote to H. this morning; he has no particulars yet about Diana. My Indian trip is cancelled, thank heavens. We dine with the Bencks at Stanmore tonight, though I have little appetite for diplomacy. Tomorrow, I escape to Edinburgh with Raymond and Cys on the 10 o'clock train. I find myself suddenly, violently revolted by Bluey—I cannot explain the intensity of it, but H. will understand.",
    historicalFacts: [
      "Attended a crowded session in the House of Commons",
      "Witnessed the Speaker's deference to Bonar Law",
      "Heard a speech regarding the treatment of the minority",
    ],
    sources: ["Reconstruction from Asquith's letter (Sep 17, 1914)."],
    visualBackground: "/timeline/Train_Paint_Sep.jpg",
    visualAlt: "Travelling to Penrhos by train",
    theme: "war",
  },
  {
    id: "sep-25",
    date: "1914-09-25",
    displayDate: "September 25th, 1914",
    location: "Viceregal Lodge, Dublin",
    coords: [53.356, -6.329], // Áras an Uachtaráin today
    diaryEntry:
      "Dublin is in a fever over the Prime Minister's visit. We are staying at the Viceregal Lodge—a 'small house party,' they call it, though it includes half the Cabinet, the McKennas, and my own parents. It is a strange comedy: chatting politely with the Aberdeens and the Crews in the drawing room, while catching H.'s eye across the crowd. He is the hero of the hour here, and I am just the Hon. Venetia Stanley to the world, but I know who he looks for when the speeches are done.",
    historicalFacts: [
      "Stayed at Viceregal Lodge, Dublin, as part of a house party",
      "Guests included the Prime Minister, the McKennas, and her parents (Lord and Lady Sheffield)",
      "Attended to meet the Prime Minister and Mrs. Asquith",
      "Picture is reconstructed from a photograph appeared in The Sketch, October 7, 1914",
    ],
    sources: ["Reconstruction from Asquith's letter (Sep 26, 1914).", "Yorskshire post (Sep, 30, 1914)"],
    visualBackground: "/timeline/1914-09-25.jpg",
    visualPrompt:
      "Exterior of the Viceregal Lodge in Dublin, 1914, imposing white neoclassical architecture, immaculate lawns with guests in formal Edwardian garden party attire, Union Jack flying, sense of occasion.",
    visualAlt: "Guests gathering at Viceregal Lodge, Dublin",
    theme: "political",
  },
  {
    id: "oct-20",
    date: "1914-10-20",
    displayDate: "October 20th, 1914",
    location: "Alderley Park, Cheshire",
    coords: [53.286, -2.234],
    diaryEntry:
      "The house is silent now that H. has gone. The last three days were divine—a suspended reality. Last night we sat up reading Hamlet; he read 'To be or not to be' aloud, his voice testing the weight of every word. We talked of short lives and long lives—strange topics for lovers, perhaps, but with the news from the front, death feels like the only honest conversation left. Now I am alone again, and the 'not to be' feels far too close.",
    historicalFacts: [
      "Spent the previous three days (Oct 17-19) with Asquith at Alderley",
      "Read Hamlet ('To be') with Asquith the previous night",
      "Discussed the contrast between 'short and long lives'",
    ],
    sources: ["Reconstruction from Asquith's letter (Oct 21, 1914)."],
    visualBackground: "/timeline/1914-10-20.jpg",
    visualPrompt:
      "Atmospheric interior of a library at night, 1914, empty armchair near a fireplace with dying embers, an open volume of Shakespeare on a side table, sense of absence and quiet melancholy.",
    visualAlt: "An empty armchair in the Alderley library",
    theme: "intimate",
  },
  {
    id: "oct-30",
    date: "1914-10-30",
    displayDate: "October 30th, 1914",
    location: "The Royal London Hospital",
    coords: [51.518503594919025, -0.05905330419722828],
    diaryEntry:
     "I am writing this from my little room at the London Hospital. The smell of carbolic and the cries from the wards are a strange accompaniment to my thoughts of Downing Street. Here, I am just a probationer learning to bandage; yet on my table sits the 'gaudy casket'—that flashy little box holding H.'s most secret papers on the Dardanelles and the crashing of Turkey into the war. It is a bizarre dual existence: scrubbing floors by day, guarding the Empire's secrets by night. I only wish he were here in this narrow room with me, though I know his place is in the Cabinet Room, and mine is... where?",
    historicalFacts: [
      "Begun nursing training/work at The Royal London Hospital",
      "Kept sealed documents for Asquith in a 'gaudy casket' in her room",
      "Wished Asquith were present in her 'little room'",
    ],
    sources: ["Reconstruction from Asquith's letter (Oct 31, 1914)."],
    visualBackground: "/timeline/London_Hospital_Paint.jpg",
    visualPrompt:
      "Exterior view of The Royal London Hospital in Whitechapel, 1914, imposing Edwardian red brick architecture, busy street scene with early ambulances and nurses in uniform walking near the gates, atmospheric and slightly gritty.",
    visualAlt: "The facade of The Royal London Hospital, Whitechapel",
    theme: "secret",
  },
  {
    id: "nov-05",
    date: "1914-11-05",
    displayDate: "November 5th, 1914",
    location: "Alderley Park, Cheshire",
    coords: [53.286, -2.234],
    diaryEntry:
      "I wrote to H. today, struggling to put into words what I feel. The war grows darker every day—Turkey in, the losses mounting. I told him I want to be a 'lit lamp' for him, something steady and bright in the gloom. It sounds sentimental, perhaps, but when I think of him alone in that cabinet room, I feel a devotion that scares me. I would burn myself out if it gave him an hour's peace.",
    historicalFacts: [
      "Wrote to Asquith from Alderley Park",
      "Used the image of a 'lit lamp' to describe her feelings",
      "Expressed deep personal devotion and support",
    ],
    sources: ["Reconstruction from Asquith's letter (Nov 6, 1914)."],
    visualBackground: "/timeline/1914-11-05.jpg",
    visualPrompt:
      "Close up of an oil lamp burning brightly on a desk in a dark room 1914, illuminating a handwritten letter, warm golden glow against deep shadows, intimate and symbolic.",
    visualAlt: "A lit lamp on a desk at night",
    theme: "intimate",
  },
  {
    id: "nov-16",
    date: "1914-11-16",
    displayDate: "November 16th, 1914",
    location: "Lympne Castle, Kent",
    coords: [51.071, 1.026],
    diaryEntry:
      "A grey, sweeping weekend at Lympne. We motored over to Canterbury and stood in the Cathedral, small beneath all that stone. H. was quiet, thinking of the men across the water, I suppose. We drove back from Rye at dusk, the marsh mists rising around the car. It felt like we were the only two people left in England. There is a comfort in this shared silence that no conversation can match.",
    historicalFacts: [
      "Stayed at Lympne Castle with Asquith",
      "Visited Canterbury Cathedral",
      "Returned from Rye at dusk",
    ],
    sources: ["Reconstruction from Asquith's letter (Nov 17, 1914)."],
    visualBackground: "/timeline/Lympne_Castle_Paint.jpg",
    visualPrompt:
      "Atmospheric view of Lympne Castle 1914 at dusk, looking out over the Romney Marsh towards the sea, mist rising, muted colours of grey and green, a vintage car parked in the foreground.",
    visualAlt: "Lympne Castle at dusk overlooking the marshes",
    theme: "social",
  },
  {
    id: "nov-21",
    date: "1914-11-21",
    displayDate: "November 21th, 1914",
    location: "18 Mansfield Street, London",
    coords: [51.519689936407765, -0.14560590552324795],
    diaryEntry:
      "Before leaving for Belcaire, I sent H. a note that cost me some courage. I have shown him the 'Venetia' of the dinner parties and the golf course, but today I tried to show him my real self—the doubts, the shadows, the parts that aren't so amusing. It is a risk. One always fears that the 'real self' will be less loved than the performance. But I cannot hide from him anymore.",
    historicalFacts: [
      "Preparing to leave for Belcaire (Lympne)",
      "Sent Asquith a note making intimate disclosures about her 'real self'",
      "Discussed Raymond's plans",
    ],
    sources: ["Reconstruction from Asquith's letter (Nov 22, 1914)."],
    visualBackground: "/timeline/1914-11-21.jpg",
    visualPrompt:
      "Reflection of a young woman in an Edwardian vanity mirror 1914, looking serious and contemplative, soft lighting, silver hairbrush and perfume bottles on the table, mood of introspection.",
    visualAlt: "Venetia looking at her reflection in a mirror",
    theme: "intimate",
  },
  {
    id: "dec-08",
    date: "1914-12-08",
    displayDate: "December 8th, 1914",
    location: "18 Mansfield Street, London",
    coords: [51.519689936407765, -0.14560590552324795],
    diaryEntry:
      "An evening with H. that was quite perfect. The war seems to have stripped away all the unnecessary things between us, leaving only a pure, quiet devotion. He accused us both of having 'a touch of phantasy'—perhaps he is right. We are living in a world of our own invention, safe from the headlines. I told him tonight that he is the only thing that matters. I think he believes me.",
    historicalFacts: [
      "Had a conversation with Asquith this evening",
      "The meeting was regarded as 'quite perfect'",
      "Expressed strong devotion to Asquith",
    ],
    sources: ["Reconstruction from Asquith's letter (Dec 9, 1914)."],
    visualBackground: "/timeline/1914-12-08.jpg",
    visualPrompt:
      "Interior of a warm, lamp-lit drawing room in London 1914, heavy velvet curtains drawn against the night, two armchairs facing each other, a discarded newspaper on the floor, atmosphere of intimacy and safety.",
    visualAlt: "An intimate evening setting in London",
    theme: "intimate",
  },
  {
    id: "dec-22",
    date: "1914-12-22",
    displayDate: "December 22nd, 1914",
    location: "24 Queen Anne's Gate, London",
    coords: [51.5, -0.134],
    diaryEntry:
      "Flowers arrived from the Assyrian today—huge, extravagant blooms, typical of him. I sent a polite note back with a tiny Christmas present for Rosie. I must go and see him before the holiday, I suppose. Meanwhile, H. writes anxiously about the stalemate in the trenches and the 'Christmas truce' rumors. It is a strange life: thanking one man for hothouse flowers while advising another on the movement of guns across Europe. Edwin offers a life of manageable prose; H. offers a tragedy in blank verse. I am not sure which I am suited for.",
    historicalFacts: [
      "Wrote to Edwin Montagu thanking him for flowers",
      "Sent a Christmas present for 'Rosie'",
      "Wrote to Asquith about the military situation (Russian artillery, new armies)",
    ],
    sources: ["Venetia Stanley to Edwin Montagu, December 22, 1914", "Reconstruction from Asquith's letter (Dec 23, 1914)."],
    visualBackground: "/timeline/1914-12-22.jpg",
    visualPrompt:
      "Still life 1914: A large, extravagant bouquet of flowers in a vase, a small wrapped Christmas gift, and a handwritten note on '24 Queen Anne's Gate' stationery, set against a window with a wintry London street outside.",
    visualAlt: "Flowers from Edwin and a note on the desk",
    theme: "social",
  },
  {
    id: "dec-29",
    date: "1914-12-29",
    displayDate: "December 29th, 1914",
    location: "Deal, Kent",
    coords: [51.221, 1.402],
    diaryEntry:
      "Motored over to Deal today. We managed a round of golf, but my mind was elsewhere. Later, we visited the bungalow where the wounded soldiers are staying. Seeing them there—bandaged, quiet, shattered—makes all our talk in London seem so theoretical. I feel I have truly taken up a new profession now. It is not just a game or a uniform anymore; it is real work, and God knows there is enough of it to do. It feels cleaner, somehow, than the emotional tangles of London. H. writes that I am his 'pole star,' but even stars can burn out.",
    historicalFacts: [
      "Motored to Deal and played golf",
      "Visited a bungalow with wounded soldiers",
      "Described having 'taken up nursing' as a new profession",
    ],
    sources: ["Reconstruction from Asquith's letter (Dec 30, 1914)."],
    visualBackground: "/timeline/1914-12-29.jpg",
    visualPrompt:
      "A windswept English seaside scene at Deal 1914, a woman in a heavy coat walking towards a wooden bungalow, wounded soldiers in convalescent blue uniforms sitting on the porch, grey sea in the background.",
    visualAlt: "Visiting wounded soldiers at Deal",
    theme: "war",
  },
];
