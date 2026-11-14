export type QueryCluster =
  | "venetia_biography" | "venetia_asquith" | "venetia_edwin"
  | "marriage_conversion" | "later_life_family" | "letters_archive"
  | "edwin_biography" | "edwin_politics" | "precipice" | "out_of_scope";

export function clusterQuery(query: string): QueryCluster {
  const q = query.toLowerCase().trim();
  const hasVenetia = /venetia|venitia|venita|benetia|venecia|ventia|stanley/.test(q);
  const hasEdwin = /edwin|montagu|montague/.test(q);
  if (/precipice|robert harris/.test(q)) return "precipice";
  if (/letter|correspond|archive/.test(q) && /(asquith|venetia|stanley)/.test(q)) return "letters_archive";
  if (/marri|wedding|husband|wife|convert|jew|synagogue/.test(q) && (hasVenetia || hasEdwin)) return "marriage_conversion";
  if (/child|daughter|son|grand|after 1915|later life|death|died/.test(q) && hasVenetia) return "later_life_family";
  if (hasVenetia && /asquith/.test(q)) return "venetia_asquith";
  if (hasVenetia && hasEdwin) return "venetia_edwin";
  if (hasVenetia) return "venetia_biography";
  if (hasEdwin && /india|declaration|secretary|politic|liberal|cabinet/.test(q)) return "edwin_politics";
  if (hasEdwin) return "edwin_biography";
  return "out_of_scope";
}

export const isRelevantQuery = (query: string) => clusterQuery(query) !== "out_of_scope";
