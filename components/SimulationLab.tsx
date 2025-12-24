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

  const instagramPosts = [
  {
    id: 0,
    user: "venetia_official",
    image: "/lab_instagram/instagram_sicily.jpg", // Placeholder filename
    caption: "Ruins and Romans. 🏛️ The Prime is very happy bird-watching and listing women’s names beginning with P. Edwin is being Tante-ish about the food. 🍊☀️ #sicily #syracuse #vacation",
    likes: 142,
    comments: [
      { user: "violetasquith", text: "Wish I hadn't missed the start! Save some ruins for me." },
      { user: "hhasquith", text: "A delightful interlude. The company makes the scenery." },
      { user: "edwin_montagu", text: "The food is oily. But you look divine." },
      { user: "margotasquith", text: "Do be careful of the water, Henry has a delicate stomach." },
      { user: "raymond_asquith", text: "Are there brigands? If not, Edwin will have to invent some for drama." },
      { user: "cynthia_asquith", text: "It looks positively mythic. You are Persephone." },
      { user: "winstonchurchill", text: "Is the harbour suitable for a dreadnought? I am curious." },
      { user: "dianacooper", text: "Bring me back a piece of marble. Or a handsome Italian." },
      { user: "occ_asquith", text: "Father wrote me three pages about a lizard. Fascinating." }
    ]
  },
  {
    id: 1,
    user: "venetia_official",
    image: "/lab_instagram/instagram_scales.jpg",
    caption: "A rainy Sunday in the New Forest. 🌧️ Discussing poetry and politics while the others walk. The Prime seems to have discovered a new perspective on things. 🗝️ #newforest #weekendaway #politics",
    likes: 89,
    comments: [
      { user: "hhasquith", text: "A turning point." },
      { user: "margotasquith", text: "I hope Henry isn't bored. He hates the damp." },
      { user: "violetasquith", text: "Is Father behaving? He usually cheats at croquet." },
      { user: "edwin_montagu", text: "I wish I were there to hold the umbrella." },
      { user: "raymond_asquith", text: "The Scales fall from his eyes? A biblical Sunday indeed." },
      { user: "dianacooper", text: "It looks terribly cozy. Is there bridge?" },
      { user: "duff_cooper", text: "What are you reading? Donne or Marvell?" },
      { user: "cynthia_asquith", text: "The light looks very Whistler-esque." }
    ]
  },
  {
    id: 2,
    user: "venetia_official",
    image: "/lab_instagram/instagram_failed_penguin.jpg",
    caption: "Went to Liverpool to buy two penguins but they were out of stock. 🐧 Consoled myself with this fox. He is moderately nice, but very shy. 🦊 #petstagram #fox #shopping",
    likes: 134,
    comments: [
      { user: "edwin_montagu", text: "I would have found you penguins if you’d asked! I’d have shipped them from Antarctica." },
      { user: "raymond_asquith", text: "A fox is more your style, Vinney. Less waddle, more bite." },
      { user: "violetasquith", text: "Only you would go shopping for waterfowl. Will it live in the bath?" },
      { user: "hhasquith", text: "A curious creature. Does he have a name?" },
      { user: "margotasquith", text: "It will smell. I forbid it at Downing Street." },
      { user: "cynthia_asquith", text: "He has a very intelligent face." },
      { user: "dianacooper", text: "Wear him as a stole when he misbehaves." },
      { user: "patrick_shaw_stewart", text: "Liverpool is a long way to go for disappointment." }
    ]
  },
  {
    id: 3,
    user: "venetia_official",
    image: "/lab_instagram/instagram_fencing.jpg",
    caption: "Fencing with Katharine three times a week. 🤺 It is rather fun. Trying to persuade Violet to join us—the Downing Street garden is the perfect place for a duel. ⚔️ #fencing #sport #downingstreet",
    likes: 112,
    comments: [
      { user: "katharine_asquith", text: "En garde! You were too quick for me today." },
      { user: "edwin_montagu", text: "Please be careful! I can't bear the thought of a scratch." },
      { user: "hhasquith", text: "A formidable pair. I shall watch from the window." },
      { user: "violetasquith", text: "I prefer my battles verbal, thank you." },
      { user: "raymond_asquith", text: "Preparing for the suffragettes? Or just Edwin?" },
      { user: "winstonchurchill", text: "Excellent training. Aggression is a virtue." },
      { user: "margotasquith", text: "You’ll ruin the grass." },
      { user: "dianacooper", text: "The outfits are rather chic, actually." }
    ]
  },
  {
    id: 4,
    user: "venetia_official",
    image: "/lab_instagram/instagram_edwin_house.jpg",
    caption: "Dining at the Silken Tent of Shem. ⛺ The Assyrian’s groaning board is spread. He is very gloomy but the food is excellent. 🍷 #dinner #queenannesgate #silkentent",
    likes: 98,
    comments: [
      { user: "hhasquith", text: "Too easily beguiled by oysters and champagne!" },
      { user: "violetasquith", text: "Is Tante in a mood? Or just the usual melancholy?" },
      { user: "dianacooper", text: "Save me a lobster. And some gossip." },
      { user: "raymond_asquith", text: "The gloom is part of the décor. It matches the velvet." },
      { user: "margotasquith", text: "Rich food gives one nightmares. Eat the fruit." },
      { user: "cynthia_asquith", text: "It looks like a seraglio." },
      { user: "patrick_shaw_stewart", text: "Is he reading his medical encyclopedia aloud again?" },
      { user: "winstonchurchill", text: "Pass the port." }
    ]
  },
  {
    id: 5,
    user: "venetia_official",
    image: "/lab_instagram/instagram_fancy_dress.jpg",
    caption: "Equipping a Russian procession for the ball. 🎭 Life is just a series of routs and riots. Bed at 3 a.m. to do it all again. 😴 #fancydress #costume #society",
    likes: 156,
    comments: [
      { user: "edwin_montagu", text: "You looked magnificent. The most beautiful woman in London." },
      { user: "margotasquith", text: "A little theatrical, perhaps? But very striking." },
      { user: "raymond_asquith", text: "The Queen of Sheba arrives. Solomon is trembling." },
      { user: "violetasquith", text: "Bakst would be jealous of that turban." },
      { user: "hhasquith", text: "I prefer you in white, but this is... commanding." },
      { user: "dianacooper", text: "We must pose for a tableau vivant." },
      { user: "cynthia_asquith", text: "So decadent. I love it." },
      { user: "patrick_shaw_stewart", text: "Who carried your train?" }
    ]
  },
  {
    id: 6,
    user: "venetia_official",
    image: "/lab_instagram/instagram_gift.jpg",
    caption: "My divine little God. 💚 Thank you, Tante. He is enshrined in his niche. I expected something funny and you sent something beautiful. #jade #gift #treasure",
    likes: 201,
    comments: [
      { user: "edwin_montagu", text: "I am glad he pleases you. He reminded me of your eyes." },
      { user: "violetasquith", text: "Very characteristic of the Assyrian to send idols." },
      { user: "dianacooper", text: "I covet him. Does he grant wishes?" },
      { user: "hhasquith", text: "A pagan altar in Mansfield Street? I am shocked." },
      { user: "margotasquith", text: "It will just collect dust, Venetia." },
      { user: "raymond_asquith", text: "Don't worship it too loudly, the Bishop might hear." },
      { user: "cynthia_asquith", text: "The green is exquisite." },
      { user: "duff_cooper", text: "A serious gift." }
    ]
  },
  {
    id: 7,
    user: "venetia_official",
    image: "/lab_instagram/instagram_river_party.jpg",
    caption: "Water Music. 🎶 Youth at the Prow and Pleasure at the Helm. Or so they say. I stayed on the bank havering. 🌊 #thames #riverparty #nocturne",
    likes: 76,
    comments: [
      { user: "dianacooper", text: "Oh God, the horror. The damp went straight to my bones." },
      { user: "raymond_asquith", text: "A tragic farce. We looked like drowned rats by midnight." },
      { user: "hhasquith", text: "Thank God you didn't go in. The Thames is treacherous." },
      { user: "edwin_montagu", text: "I would have rescued you." },
      { user: "violetasquith", text: "It looked very atmospheric from a distance, at least." },
      { user: "patrick_shaw_stewart", text: "The music was good, until the cello floated away." },
      { user: "margotasquith", text: "River air is fatal for the complexion." },
      { user: "cynthia_asquith", text: "Very Watteau, if Watteau painted in the rain." }
    ]
  },
  {
    id: 8,
    user: "venetia_official",
    image: "/lab_instagram/instagram_golf.jpg",
    caption: "Beating the Prime at Huntercombe. ⛳ He is very bird-happy despite the crisis. Now back to the Wharf for bridge. ♠️♦️ #golf #huntercombe #weekend",
    likes: 110,
    comments: [
      { user: "hhasquith", text: "You played above your form. I demand a rematch." },
      { user: "margotasquith", text: "Henry needs his exercise. Don't let him smoke too much." },
      { user: "edwin_montagu", text: "I wish I were caddying. Or just watching you swing." },
      { user: "raymond_asquith", text: "A good walk spoiled, as they say. Who won the money?" },
      { user: "violetasquith", text: "Did he cheat? Be honest." },
      { user: "winstonchurchill", text: "Focus is key. Eye on the ball." },
      { user: "cynthia_asquith", text: "I love your tweeds." },
      { user: "birrell_augustine", text: "The Prime Minister looks entirely too relaxed." }
    ]
  },
  {
    id: 9,
    user: "venetia_official",
    image: "/lab_instagram/instagram_yacht.jpg",
    caption: "Drifting about on the Enchantress. 🛥️ Long intervals of doing nothing and then going to divine inaccessible places. Winston is talking about naval estimates; I am reading. 📖 #enchantress #navy #sea",
    likes: 145,
    comments: [
      { user: "winstonchurchill", text: "We must keep our powder dry. The German fleet is growing." },
      { user: "violetasquith", text: "Is it very rough? I always feel green on that boat." },
      { user: "edwin_montagu", text: "I hate the sea. Come back to solid ground." },
      { user: "hhasquith", text: "I miss our bridge game. The Captain plays terribly." },
      { user: "margotasquith", text: "Don't let Winston exhaust you. He never stops talking." },
      { user: "raymond_asquith", text: "Gunboat diplomacy looks rather comfortable." },
      { user: "dianacooper", text: "Is the wind ruining your hair? It looks wild." },
      { user: "clementine_churchill", text: "Winston is so happy to have an audience." }
    ]
  },
  {
    id: 10,
    user: "venetia_official",
    image: "/lab_instagram/instagram_Alderley.jpg",
    caption: "Back at Alderley. 🌳 Attempting to educate the livestock and avoid my parochial duties. The parents are arguing about unitarianism. Standard. 🦜 #alderley #cheshire #family",
    likes: 92,
    comments: [
      { user: "bertrand_russell", text: "I tremble to come to lunch. The theological debate sounds intense." },
      { user: "edwin_montagu", text: "I miss the dogs. And you. Mostly you." },
      { user: "violetasquith", text: "Is the pug behaving? Give him a kiss from me." },
      { user: "hhasquith", text: "Write to me. I need a distraction from the Cabinet." },
      { user: "margotasquith", text: "Your mother is a saint. Your father... is characteristic." },
      { user: "raymond_asquith", text: "Rural hell. Escape while you can." },
      { user: "dianacooper", text: "I’m dying of boredom just reading this." },
      { user: "cynthia_asquith", text: "Does the parrot know any swear words yet?" }
    ]
  },
  {
    id: 11,
    user: "venetia_official",
    image: "/lab_instagram/instagram_new_years_games.jpg",
    caption: "Ringing in 1914 with Commerce and punch. 🥂 The Prime is learning card games. Tante looks like he's lost a fortune. 🎉 #newyear #1914 #gamesnight",
    likes: 123,
    comments: [
      { user: "hhasquith", text: "A red-letter night. I am improving." },
      { user: "edwin_montagu", text: "I only want one prize, and I didn't win it." },
      { user: "cynthia_asquith", text: "What a crew! The noise was deafening." },
      { user: "violetasquith", text: "Father cheats. I saw him hide a card." },
      { user: "raymond_asquith", text: "The punch was lethal. Who made it?" },
      { user: "margotasquith", text: "Too much gambling. It sets a bad example." },
      { user: "winstonchurchill", text: "Strategy, Prime Minister. Strategy." },
      { user: "dianacooper", text: "I have a headache just looking at this." }
    ]
  },
  {
    id: 12,
    user: "venetia_official",
    image: "/lab_instagram/instagram_car.jpg",
    caption: "The weekly migration. 🚗 escaping the bores and the bishops. Discussing the Irish question and poetry between London and the Wharf. #roadtrip #thewharf #friday",
    likes: 88,
    comments: [
      { user: "hhasquith", text: "The best hour of the week. Solitude at last." },
      { user: "margotasquith", text: "Mind the draft, Henry. And drive slowly." },
      { user: "edwin_montagu", text: "Lucky man. I am stuck in the city." },
      { user: "violetasquith", text: "What poem is it this week? Keats?" },
      { user: "raymond_asquith", text: "Try not to crash while discussing Home Rule." },
      { user: "dianacooper", text: "The dust must be awful." },
      { user: "patrick_shaw_stewart", text: "I hope the car breaks down near a pub." },
      { user: "cynthia_asquith", text: "Are you driving? God help the pedestrians." }
    ]
  },
  {
    id: 13,
    user: "venetia_official",
    image: "/lab_instagram/instagram_war.jpg",
    caption: "It’s done. 🇬🇧 The Prime is calm, Winston is excited, and the world is upside down. I suppose we must all be very brave and busy now. #war #london #history",
    likes: 350,
    comments: [
      { user: "violetasquith", text: "It feels like the end of everything. I can't stop crying." },
      { user: "raymond_asquith", text: "The fun begins. See you at the front." },
      { user: "edwin_montagu", text: "God help us. It will be a long night." },
      { user: "hhasquith", text: "We must do our duty. Courage, my dear." },
      { user: "winstonchurchill", text: "The fleet is ready. Glory awaits." },
      { user: "margotasquith", text: "My poor boys. Everyone is so hysterical." },
      { user: "cynthia_asquith", text: "The crowds are frightening." },
      { user: "dianacooper", text: "The lights are going out all over London." }
    ]
  },
  {
    id: 14,
    user: "venetia_official",
    image: "/lab_instagram/instagram_Donnington.jpg",
    caption: "Sending woollies to the German prisoners. 🧶 Apparently, this makes me a traitor. I think it’s just cold. People are so hysterical. 📦 #charity #knitting #scandal",
    likes: 105,
    comments: [
      { user: "margotasquith", text: "They are saying I feed them dainties! It is a lie. They are vicious." },
      { user: "hhasquith", text: "Ignore the gutter press, my darling. You are kind." },
      { user: "violetasquith", text: "So sensible of you, V. Cold is cold, even for a Hun." },
      { user: "raymond_asquith", text: "Very Christian of you. The press will hate it." },
      { user: "edwin_montagu", text: "I worry about your reputation. Be careful." },
      { user: "winstonchurchill", text: "They don't deserve your knitting." },
      { user: "cynthia_asquith", text: "I can't even knit a sock properly." },
      { user: "dianacooper", text: "Send them to our boys instead!" }
    ]
  },
  {
    id: 15,
    user: "venetia_official",
    image: "/lab_instagram/instagram_letters.jpg",
    caption: "The Prime writes during Cabinet. ✉️ Reading about the Dardanelles and submarine nets while everyone else reads the papers. I feel like a conspirator. 🤫 #letters #secrets #cabinet",
    likes: 180,
    comments: [
      { user: "hhasquith", text: "Burn this. Immediately." },
      { user: "edwin_montagu", text: "Be careful, my dear. These are dangerous times." },
      { user: "violetasquith", text: "Father tells you more than he tells the King. It's extraordinary." },
      { user: "winstonchurchill", text: "Who leaked the naval plans? Ah..." },
      { user: "margotasquith", text: "Henry writes too much. He needs to focus." },
      { user: "raymond_asquith", text: "Mata Hari has nothing on you." },
      { user: "dianacooper", text: "The ink looks fresh. What does K say?" },
      { user: "cynthia_asquith", text: "I love a secret." }
    ]
  },
  {
    id: 16,
    user: "venetia_official",
    image: "/lab_instagram/instagram_chrismas_1914.jpg",
    caption: "Christmas at the Castle. 🏰 Mezzotints of Lord Wardens and the sound of the sea. K and French came down and had a battle royal. The Prime smoothed it over. 🌊 #walmercastle #christmas #sea",
    likes: 130,
    comments: [
      { user: "cynthia_asquith", text: "Did you see the ghost? It’s freezing there." },
      { user: "hhasquith", text: "A nest. If only you were here longer. The peace is gone now." },
      { user: "edwin_montagu", text: "Jealous. I am stuck in London." },
      { user: "violetasquith", text: "The wind at Walmer is enough to kill one." },
      { user: "winstonchurchill", text: "The defenses must be checked. I shall visit." },
      { user: "margotasquith", text: "The beds are damp. I hope you wore wool." },
      { user: "raymond_asquith", text: "Did Kitchener break anything?" },
      { user: "dianacooper", text: "It sounds dreadfully romantic and grim." }
    ]
  },
  {
    id: 17,
    user: "venetia_official",
    image: "/lab_instagram/instagram_nurse.jpg",
    caption: "The new life. 🏥 Scrubbing, sweeping, and ‘turning’ patients. My hands are ruined. It is all very squalid, but at least it’s a change from bridge. 💊 #nursing #hospital #warwork",
    likes: 210,
    comments: [
      { user: "hhasquith", text: "I hate to think of you doing slut’s work. My heart bleeds." },
      { user: "violetasquith", text: "You are a heroine. I couldn't stand the blood." },
      { user: "edwin_montagu", text: "Come away. It’s too dangerous and dirty." },
      { user: "margotasquith", text: "Wash your hands thoroughly. The germs are everywhere." },
      { user: "dianacooper", text: "Do you have a chic uniform at least?" },
      { user: "raymond_asquith", text: "Reality bites. Good for the soul, they say." },
      { user: "cynthia_asquith", text: "It sounds exhausting. You are brave." },
      { user: "winstonchurchill", text: "Service to the nation. Well done." }
    ]
  },
  {
    id: 18,
    user: "venetia_official",
    image: "/lab_instagram/instagram_rain.jpg",
    caption: "A difficult drive. 🌧️ The Prime is unhappy, Edwin is frantic, and I have a headache. Sometimes one feels like a bone between two dogs. #travel #rain #mood",
    likes: 95,
    comments: [
      { user: "edwin_montagu", text: "It was torture. I can't bear seeing you like this." },
      { user: "hhasquith", text: "You were elusive. I felt I couldn't reach you." },
      { user: "cynthia_asquith", text: "The atmosphere sounds electric. And not in a good way." },
      { user: "violetasquith", text: "Poor V. The tension must be unbearable." },
      { user: "margotasquith", text: "Take an aspirin. Men are tiresome." },
      { user: "raymond_asquith", text: "The drama continues. Who will snap first?" },
      { user: "dianacooper", text: "I send you sympathy. And gin." },
      { user: "patrick_shaw_stewart", text: "A car full of silent screaming." }
    ]
  },
  {
    id: 19,
    user: "venetia_official",
    image: "/lab_instagram/instagram_decision.jpg",
    caption: "Making up my mind. 💭 It seems the only way out of the maze. I’m going to do it. #decisions #future #letters",
    likes: 310,
    comments: [
      { user: "edwin_montagu", text: "!!! I am the happiest man alive." },
      { user: "violetasquith", text: "? What are you plotting?" },
      { user: "raymond_asquith", text: "Sensible girl. Secure the future." },
      { user: "hhasquith", text: "..." },
      { user: "margotasquith", text: "Is it Tante? I suspect it is." },
      { user: "cynthia_asquith", text: "Tell me everything immediately." },
      { user: "dianacooper", text: "A bold move. I approve." },
      { user: "duff_cooper", text: "Good luck." }
    ]
  },
  {
    id: 20,
    user: "venetia_official",
    image: "/lab_instagram/instagram_to_france.jpg",
    caption: "Goodbye, England. 👋 Off to Wimereux to nurse. Leaving a lot of trouble behind me. Hope the sea air clears my head. 🚢 #ferry #channel #escape",
    likes: 167,
    comments: [
      { user: "hhasquith", text: "Desolate. The light has gone out." },
      { user: "edwin_montagu", text: "Come back soon. I am counting the days." },
      { user: "violetasquith", text: "Why this sudden flight? It feels like desertion." },
      { user: "margotasquith", text: "Running away? Perhaps it is for the best." },
      { user: "raymond_asquith", text: "Cowardice or bravery? Hard to say." },
      { user: "winstonchurchill", text: "The Channel is dangerous. Watch for mines." },
      { user: "cynthia_asquith", text: "We shall miss you terribly." },
      { user: "dianacooper", text: "Be safe, darling." }
    ]
  },
  {
    id: 21,
    user: "venetia_official",
    image: "/lab_instagram/instagram_Wimereux.jpg",
    caption: "No hot water, flies, and acids. 🏥 But it is very peaceful and impersonal here. I rather like the squalor. A new sensation. #wimereux #nursing #france",
    likes: 140,
    comments: [
      { user: "edwin_montagu", text: "I am sending hampers. You shall not starve." },
      { user: "dianacooper", text: "Are there any attractive doctors? Or just gore?" },
      { user: "hhasquith", text: "My thoughts are always there. I write daily." },
      { user: "violetasquith", text: "It sounds grim. How do you stand the smell?" },
      { user: "margotasquith", text: "Don't catch typhus. It is rampant." },
      { user: "raymond_asquith", text: "Stoicism suits you. Very Roman." },
      { user: "cynthia_asquith", text: "Please write when you can." },
      { user: "patrick_shaw_stewart", text: "Don't smoke too much French tobacco." }
    ]
  },
  {
    id: 22,
    user: "venetia_official",
    image: "/lab_instagram/instagram_letter.jpg",
    caption: "It had to be done. ✉️ Better a clean break than a long drag. I hope he forgives me. #theletter #endings #truth",
    likes: 420,
    comments: [
      { user: "edwin_montagu", text: "You are brave. It is the only way." },
      { user: "violetasquith", text: "I can't believe it. You have broken him." },
      { user: "raymond_asquith", text: "The crash comes. Stand back." },
      { user: "margotasquith", text: "I am in shock. Henry is destroyed." },
      { user: "winstonchurchill", text: "He cannot focus on the war. It is a disaster." },
      { user: "cynthia_asquith", text: "Oh, Venetia. What have you done?" },
      { user: "dianacooper", text: "Cruel to be kind?" },
      { user: "hhasquith", text: "💔" }
    ]
  },
  {
    id: 23,
    user: "venetia_official",
    image: "/lab_instagram/instagram_Boulogne.jpg",
    caption: "Saw the Old Boy. 💔 He is very broken, but he was sweet. I think we shall be friends again, in time. #boulogne #reunion #sadness",
    likes: 280,
    comments: [
      { user: "edwin_montagu", text: "You are an angel to see him. I know it was hard." },
      { user: "violetasquith", text: "It must have been awful. He looks ten years older." },
      { user: "margotasquith", text: "Henry has returned looking old. It is tragic." },
      { user: "raymond_asquith", text: "Closure? Or just more pain?" },
      { user: "cynthia_asquith", text: "Did you cry? I would have wept." },
      { user: "hhasquith", text: "Goodbye, my darling." },
      { user: "dianacooper", text: "The end of an era." },
      { user: "winstonchurchill", text: "Now he must get back to work." }
    ]
  },
  {
    id: 24,
    user: "venetia_official",
    image: "/lab_instagram/instagram_judaism.jpg",
    caption: "Cramming for the exam. 📚 Trying to memorize the Paschal Lamb between drinks. I hope the Rabbi doesn't ask too many questions. 🕍 #conversion #study #champagne",
    likes: 115,
    comments: [
      { user: "edwin_montagu", text: "It will be easy, darling. Just say yes." },
      { user: "violetasquith", text: "This is a farce. You, a Jewess?" },
      { user: "raymond_asquith", text: "Worth it for the settlement. And the brains." },
      { user: "margotasquith", text: "Is it necessary? It seems very extreme." },
      { user: "hhasquith", text: "..." },
      { user: "cynthia_asquith", text: "Do you have to learn Hebrew?" },
      { user: "dianacooper", text: "Will there be a party after?" },
      { user: "patrick_shaw_stewart", text: "Don't laugh at the Rabbi." }
    ]
  },
  {
    id: 25,
    user: "venetia_official",
    image: "/lab_instagram/instagram_Trousseau.jpg",
    caption: "Shopping with Cynthia. 👗 Trying to look like a bride. The gold flame dress is a success, I think. 💸 #trousseau #fashion #jays",
    likes: 198,
    comments: [
      { user: "cynthia_asquith", text: "You look like a magnificent Jewess. It suits you." },
      { user: "edwin_montagu", text: "Buy everything you want. Send me the bills." },
      { user: "margotasquith", text: "Extravagant. But I suppose you can afford it now." },
      { user: "violetasquith", text: "A high price for a wardrobe." },
      { user: "dianacooper", text: "Show us the furs! I hear they are divine." },
      { user: "raymond_asquith", text: "The Swaythling dowry at work." },
      { user: "hhasquith", text: "You will look beautiful." },
      { user: "katharine_asquith", text: "Gold flame? Very dramatic." }
    ]
  },
  {
    id: 26,
    user: "venetia_official",
    image: "/lab_instagram/instagram_jewels.jpg",
    caption: "Edwin’s loot. 💎 He is very generous. I shall look like the Queen of Sheba. #diamonds #pearls #gifts",
    likes: 245,
    comments: [
      { user: "dianacooper", text: "Dazzling. I am green with envy." },
      { user: "violetasquith", text: "A high price. Are they heavy?" },
      { user: "edwin_montagu", text: "Only a start. You deserve the world." },
      { user: "margotasquith", text: "A bit vulgar, perhaps? But impressive." },
      { user: "raymond_asquith", text: "Get them insured. Immediately." },
      { user: "cynthia_asquith", text: "They are blinding. You'll need sunglasses." },
      { user: "hhasquith", text: "Swag." },
      { user: "duff_cooper", text: "The spoils of war." }
    ]
  },
  {
    id: 27,
    user: "venetia_official",
    image: "/lab_instagram/instagram_wedding.jpg",
    caption: "Mrs. Montagu. 💍 We are off to Polesden Lacey. The deed is done. #wedding #justmarried #mrsmontagu",
    likes: 560,
    comments: [
      { user: "hhasquith", text: "❤️" },
      { user: "katharine_asquith", text: "Good luck, Vinney." },
      { user: "cynthia_asquith", text: "You looked calm. Edwin looked terrified." },
      { user: "violetasquith", text: "I suppose I must wish you happiness." },
      { user: "raymond_asquith", text: "To the happy couple. Cheers." },
      { user: "margotasquith", text: "Those boots of Edwin's were too tight." },
      { user: "winstonchurchill", text: "Congratulations. A new chapter." },
      { user: "dianacooper", text: "Long life and joy." }
    ]
  },
  {
    id: 28,
    user: "venetia_official",
    image: "/lab_instagram/instagram_honeymoon.jpg",
    caption: "Our new toy. 🏡 Breccies is divine—moths, bats, and all. Edwin is happy shooting things. I am arranging the furniture. #breccies #norfolk #newhome",
    likes: 178,
    comments: [
      { user: "dianacooper", text: "When can we come stay? I need a holiday." },
      { user: "edwin_montagu", text: "My home. Our home." },
      { user: "violetasquith", text: "It sounds remote. Do you have neighbors?" },
      { user: "margotasquith", text: "Is it damp? Norfolk is notoriously damp." },
      { user: "raymond_asquith", text: "Good shooting? Don't shoot the guests." },
      { user: "cynthia_asquith", text: "Moths? Sounds charmingly gothic." },
      { user: "hhasquith", text: "I miss you. London is empty." },
      { user: "patrick_shaw_stewart", text: "Any ghosts?" }
    ]
  },
  {
    id: 29,
    user: "venetia_official",
    image: "/lab_instagram/instagram_green_room.jpg",
    caption: "The Silken Tent is ready. 🦜 Green lacquer and gold. Prepared to receive the Coterie. Let the games begin. ♠️♥️ #decor #greenroom #coterie",
    likes: 215,
    comments: [
      { user: "cynthia_asquith", text: "Elinor Glyn would be proud. It's very vampy." },
      { user: "dianacooper", text: "It’s a setting for a masterpiece. We shall hold court." },
      { user: "hhasquith", text: "I shall come for bridge. Save me a seat." },
      { user: "edwin_montagu", text: "I am happy if you are happy." },
      { user: "violetasquith", text: "Very exotic. A bit... Oriental." },
      { user: "raymond_asquith", text: "Perfect for poker. And scandal." },
      { user: "margotasquith", text: "How much did the lacquer cost? It looks expensive." },
      { user: "winstonchurchill", text: "When is the party? I need a drink." }
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
      <section className="flex-1 max-w-4xl overflow-y-auto pr-6 custom-scrollbar border-2 border-[#4A7C59]/30 rounded-lg p-6 bg-[#F5F3EF]/30">
        <header className="mb-12">
          <p className="text-[#4A7C59] font-black uppercase tracking-[0.3em] text-[10px] mb-2">The Venetia Project Simulation Lab</p>
          <h1 className="text-4xl font-bold text-[#1A2A40] mb-2 tracking-tight">Generative Correspondence</h1>
          <div className="h-1 w-24 bg-[#4A7C59]"></div>
          <p className="mt-4 text-sm italic text-[#6B7280]">Chronicle Displacement: Reconstructing the dialogue between Venetia Stanley and the Prime Minister.</p>
        </header>

        {/* Section Explanation */}
        <div className="mb-12 p-6 bg-[#F5F3EF] border-l-4 border-[#4A7C59] rounded-r-lg">
          <h2 className="text-lg font-bold text-[#1A2A40] mb-3">What is this?</h2>
          <p className="text-sm text-[#4B5563] leading-relaxed mb-4">
            This section reconstructs three of Venetia Stanley's lost letters to H.H. Asquith by analyzing his responses. 
            The historical record preserves Asquith's letters, but Venetia's side of the correspondence was destroyed. 
            By carefully examining what Asquith quotes, references, and responds to, we can infer the content and tone 
            of her original letters.
          </p>
          <h2 className="text-lg font-bold text-[#1A2A40] mb-3">Why did we do this?</h2>
          <p className="text-sm text-[#4B5563] leading-relaxed">
            Because sometimes it is easier to imagine Venetia when she is writing.
            Her letters are lost, but her presence in the correspondence is not. 
            When reading Asquith’s replies closely, one begins to sense her tone, her provocations, her restraint, her economy of feeling. 
            Thinking about what she might have written — sentence by sentence — makes her feel less abstract and less mythic..
          </p>
        </div>

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
      {/* <aside className="w-auto hidden lg:flex gap-6 flex-shrink-0 overflow-y-auto custom-scrollbar"> */}
        {/* Audio Section */}
        <div className="w-[380px] flex flex-col gap-4 border-2 border-[#A67C52]/30 rounded-lg p-4 bg-[#EBE7DF]/30 h-fit">
          {/* Audio Section Explanation */}
          <div className="bg-[#EBE7DF] rounded-2xl p-6 border border-[#C4BFAF] shadow-sm">
            <h2 className="text-4xl font-bold text-[#1A2A40] tracking-light mb-3">Audio Reconstruction</h2>
            <p className="text-sm text-[#4B5563] leading-relaxed mb-3">
              <strong className="text-[#1A2A40]">What is this?</strong> This is an audio reconstruction of Asquith 
              reading one of his famous letters to Venetia. 
              The recording was created by modelling Asquith’s voice using surviving audio from a public speech he delivered in 1909, and applying it to the text of a letter preserved in the archive.
            </p>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              <strong className="text-[#1A2A40]">Why did we do this?</strong> The written word captures only part of 
              the intimacy of these letters. Hearing them read aloud—with the pauses, emphasis, and emotional tone— 
              brings us closer to understanding how these words were meant to be received. It transforms the archival 
              document into a living moment of communication.
            </p>
          </div>

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
        </div>

        {/* Instagram Section */}
        <div className="w-[380px] flex flex-col gap-4 border-2 border-[#1A2A40]/30 rounded-lg p-4 bg-white/30 h-fit">
          {/* Instagram Section Explanation */}
          <div className="bg-white rounded-2xl p-6 border border-[#C4BFAF] shadow-sm">
            <h2 className="text-4xl font-bold text-[#1A2A40] tracking-light mb-3">Instagram Displacement</h2>
            <p className="text-sm text-[#4B5563] leading-relaxed mb-3">
              <strong className="text-[#1A2A40]">What is this?</strong> This is a speculative Instagram feed for 
              Venetia Stanley, translating her historical experiences and personality into contemporary social media 
              format. The posts capture moments from her life—boredom in the country, shopping trips, social activities— 
              as she might have shared them today.
            </p>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              <strong className="text-[#1A2A40]">Why did we do this?</strong> Because it was <strong>fun</strong> - as Venetia probably would have said.
              And because, in the process, it exposes a difference that is easy to overlook. 
              It is difficult, from a contemporary standpoint, to imagine caring so little about public self-presentation. 
              For Venetia and her world, the private and the public were not continuously performed, curated, and revised.
            </p>
          </div>

          {/* Instagram Displacement Box */}
          <div className="bg-white rounded-[40px] border-[10px] border-[#1A2A40] h-[640px] shadow-2xl flex flex-col overflow-hidden relative">
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
        </div>
      {/* </aside> */}

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
