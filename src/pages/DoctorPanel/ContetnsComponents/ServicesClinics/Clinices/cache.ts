import type { Province, City } from '../../../../../types/types.ts';

interface CacheData {
  provinces: Province[];
  cities: { [provinceId: number]: City[] };
  timestamp: number;
}

const CACHE_KEY = 'location_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 ساعت

export const getCachedLocations = (): CacheData => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return { provinces: [], cities: {}, timestamp: 0 };

  const parsed = JSON.parse(cached);
  const now = Date.now();
  if (now - parsed.timestamp > CACHE_DURATION) {
    localStorage.removeItem(CACHE_KEY);
    return { provinces: [], cities: {}, timestamp: 0 };
  }
  return parsed;
};

export const setCachedLocations = (provinces: Province[], cities: { [provinceId: number]: City[] }) => {
  const cacheData: CacheData = {
    provinces,
    cities,
    timestamp: Date.now(),
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
};

export const updateCachedCities = (provinceId: number, cities: City[]) => {
  const currentCache = getCachedLocations();
  currentCache.cities[provinceId] = cities;
  setCachedLocations(currentCache.provinces, currentCache.cities);
};