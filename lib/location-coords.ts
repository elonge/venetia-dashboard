// Location to coordinate mapping for historical places
export interface LocationCoords {
  lat: number;
  lng: number;
  name: string;
}

const LOCATION_MAP: Record<string, LocationCoords> = {
  // London locations
  '10 Downing Street': { lat: 51.5034, lng: -0.1276, name: '10 Downing Street' },
  'Downing Street': { lat: 51.5034, lng: -0.1276, name: 'Downing Street' },
  '10 Downing St': { lat: 51.5034, lng: -0.1276, name: '10 Downing Street' },
  'Cabinet Room, 10 Downing Street': { lat: 51.5034, lng: -0.1276, name: '10 Downing Street' },
  'Queen Anne\'s Gate': { lat: 51.4985, lng: -0.1332, name: 'Queen Anne\'s Gate' },
  '8 Queen Anne\'s Gate': { lat: 51.4985, lng: -0.1332, name: 'Queen Anne\'s Gate' },
  'London': { lat: 51.5074, lng: -0.1278, name: 'London' },
  
  // Country houses and estates
  'Alderley': { lat: 53.3017, lng: -2.2289, name: 'Alderley' },
  'Alderley Park': { lat: 53.3017, lng: -2.2289, name: 'Alderley' },
  'Stanway House': { lat: 51.9827, lng: -1.9205, name: 'Stanway House' },
  'Stanway': { lat: 51.9827, lng: -1.9205, name: 'Stanway House' },
  'The Wharf': { lat: 51.5333, lng: -1.1333, name: 'The Wharf, Sutton Courtenay' },
  'Sutton Courtenay': { lat: 51.5333, lng: -1.1333, name: 'Sutton Courtenay' },
  
  // Other locations
  'Larne': { lat: 54.8567, lng: -5.8183, name: 'Larne' },
  'Dublin': { lat: 53.3498, lng: -6.2603, name: 'Dublin' },
  'Ireland': { lat: 53.4129, lng: -8.2439, name: 'Ireland' },
};

/**
 * Attempts to extract coordinates from a location string
 * Returns null if no match found
 */
export function getLocationCoords(locationString: string | null | undefined): LocationCoords | null {
  if (!locationString) return null;
  
  const normalized = locationString.trim();
  
  // Check exact matches first
  if (LOCATION_MAP[normalized]) {
    return LOCATION_MAP[normalized];
  }
  
  // Check partial matches (case insensitive)
  for (const [key, coords] of Object.entries(LOCATION_MAP)) {
    if (normalized.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(normalized.toLowerCase())) {
      return { ...coords, name: normalized };
    }
  }
  
  return null;
}

/**
 * Extract multiple unique locations from a day's data
 */
export function extractLocationsFromDay(day: {
  venetia_location?: string | null;
  pm_location?: string | null;
}): LocationCoords[] {
  const locations: LocationCoords[] = [];
  const seen = new Set<string>();
  
  const venetiaCoords = getLocationCoords(day.venetia_location);
  if (venetiaCoords && !seen.has(`${venetiaCoords.lat},${venetiaCoords.lng}`)) {
    locations.push(venetiaCoords);
    seen.add(`${venetiaCoords.lat},${venetiaCoords.lng}`);
  }
  
  const pmCoords = getLocationCoords(day.pm_location);
  if (pmCoords && !seen.has(`${pmCoords.lat},${pmCoords.lng}`)) {
    locations.push(pmCoords);
    seen.add(`${pmCoords.lat},${pmCoords.lng}`);
  }
  
  return locations;
}


