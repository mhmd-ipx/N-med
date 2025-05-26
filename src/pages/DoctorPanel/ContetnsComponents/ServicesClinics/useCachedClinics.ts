import type { Clinic } from '../../../../types/types.ts';
import   getClinics from '../../../../services/serverapi.ts';


interface CacheData {
  clinics: Clinic[];
  timestamp: number;
}

const CACHE_KEY = 'clinics_cache';
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 ساعت

// تابع برای دریافت یا به‌روزرسانی کلینیک‌ها
export const useCachedClinics = async (token: string, forceRefresh: boolean = false): Promise<Clinic[]> => {
  // تابع کمکی برای دریافت کش
  const getCachedClinics = (): Clinic[] | null => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (!cachedData) return null;

    const { clinics, timestamp }: CacheData = JSON.parse(cachedData);
    const now = Date.now();
    if (now - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return clinics;
  };

  // تابع کمکی برای ذخیره در کش
  const setCachedClinics = (clinics: Clinic[]) => {
    const cacheData: CacheData = {
      clinics,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  };

  // بررسی کش
  if (!forceRefresh) {
    const cachedClinics = getCachedClinics();
    if (cachedClinics) {
      return cachedClinics;
    }
  }

  // تنظیم توکن و فراخوانی API
  localStorage.setItem('authData', JSON.stringify({ token }));
  const response = await getClinics(token);
  setCachedClinics(response.data.clinics);
  return response.data.clinics;
};