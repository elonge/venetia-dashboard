export const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>';

const cartoApiKey = process.env.NEXT_PUBLIC_CARTO_API_KEY;

export const CARTO_LIGHT_TILE_URL = cartoApiKey
  ? `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?key=${encodeURIComponent(cartoApiKey)}`
  : null;
