import type { Clinic } from '../../../../../types/types.ts';
import { getClinics } from '../../../../../services/serverapi.ts';

interface CacheData {
  clinics: Clinic[];
  timestamp: number;
}

const CACHE_KEY = 'clinics_cache';
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 ساعت

export const getCachedClinics = (): Clinic[] | null => {
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

export const fetchClinicsData = async (
  _p0: string, setClinics: (clinics: Clinic[]) => void, setError: (error: string | null) => void, setIsLoading: (isLoading: boolean) => void) => {
  try {
    setIsLoading(true);
    const response = await getClinics();
    const clinics = response.data; // اصلاح: مستقیماً از response.data استفاده کنید
    setClinics(clinics);
    setError(null);

    // ذخیره در کش
    const cacheData: CacheData = {
      clinics,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (err) {
    console.error('Error fetching clinics:', err);
    setError('خطا در دریافت اطلاعات کلینیک‌ها');
    setClinics([]);
  } finally {
    setIsLoading(false);
  }
};