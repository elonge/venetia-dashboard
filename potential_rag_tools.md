## List of tools
1. get_correspondence_metrics(time range, sender, recipient?, metrics=["romantic_intensity_score", "sentiment_towards_churchill"], granularity) -> list of sentiment scores
2. get_parliament_chunks_in_range (time range, query="when the shells scandal was mentioned") -> list of chunks
3. get_cabinet_chunks_in_range(time range, query="where the shells scandal was mentioned") -> list of chunks
4. get_personal_chunks_in_range(author, recipient?, time range, query="where he talks about churchil") -> list of chunks
5. get_historian_opinion(topic="Venetia infuence", historians=list, or null which means all) -> list of chunks
6. get_daily_locations_and_proximiy(time range) -> list of (day, asquith location, venetia location, their proximity)
7. find_dates_of_venetia_asquith_correspondance(time range, query="when he said she doesn't write enough") -> list of dates
8. get_weather_records(time range, station) -> list of weather records and dates


### Notes

- All tools should have the basic knowledge base
- Use a cheap/fast LLM to score metrics.
- Consider pagination and required context.



### Exmaple of questions:
1. **The "Political-Emotional" Correlation**  
   "Plot the sentiment of H.H. Asquith’s private letters to Venetia against major Allied defeats in 1914-1915. Is there a verifiable lag or an immediate correlation between bad war news and his romantic intensity?"

2. **The "Influence" Investigation**  
   "Identify instances where Asquith’s stance in Cabinet meetings (based on Minutes/Hansard) changed on a specific issue within 48 hours of a letter from Venetia discussing that same topic."

3. **The "Triangulation" of Truth**  
   "Compare the accounts of the 'Shell Scandal' (May 1915) from three perspectives: Asquith’s letters (immediate reaction), Margot Asquith’s diary (contemporary observer), and Roy Jenkins’ biography (retrospective analysis). Highlight the factual discrepancies."

4. **The "Geospatial" Network**  
   "Generate a timeline of weekends where Venetia Stanley and Edwin Montagu were at the same country house while Asquith was in London. Did the frequency of Asquith’s letters increase during these specific periods?"

5. **The "Coded Language" Decoder**  
   "Trace the usage of the nickname 'The Assyrian' (Edwin Montagu) in Asquith’s letters. Does the context of this term shift from affectionate to hostile as the love triangle intensifies in 1915?"

6. **The "Silence" Analysis**  
   "List all periods longer than 3 days where Asquith sent no letters to Venetia. Cross-reference these 'silence gaps' with the Hansard or Court Circular to determine if he was ill, traveling, or politically overwhelmed."

7. **The "Social Circle" Graph**  
   "Who were the top 5 'bridge' figures connecting the 'Corrupt Coterie' and the 'Souls' based on co-occurrence in the diaries of Cynthia Asquith and Violet Bonham Carter?"

8. **The "Stylometric" Shift**  
   "Analyze the lexical complexity and sentence length of Asquith’s letters before and after the formation of the Coalition Government (May 1915). Did his writing style simplify under extreme political stress?"

9. **The "Topic Drift" Visualization**  
   "Show me the evolution of the topic 'Irish Home Rule' versus 'Gossip' in the correspondence. When does the war completely displace domestic politics as the dominant theme?"

10. **The "Micro-History" Reconstruction**  
   "Reconstruct the hourly timeline of May 12, 1915 (The Breakup), integrating every available timestamp from letters, telegrams, and diary entries to show exactly when Asquith received the 'breaking news' letter."
