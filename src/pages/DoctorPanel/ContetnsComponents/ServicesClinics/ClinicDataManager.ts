import { getClinics } from '../../../../services/serverapi.ts';
import type { Clinic } from '../../../../types/types.ts';

const CACHE_KEY = 'clinics_cache';
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 ساعت

export const getCachedClinics = (): Clinic[] | null => {
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (!cachedData) return null;

  const { clinics, timestamp } = JSON.parse(cachedData);
  const now = Date.now();
  if (now - timestamp > CACHE_EXPIRY) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
  return clinics;
};

export const setCachedClinics = (clinics: Clinic[]) => {
  const cacheData = {
    clinics,
    timestamp: Date.now(),
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
};

export const fetchClinicsData = async (
  token: string,
  setClinics: (clinics: Clinic[]) => void,
  setError: (error: string | null) => void,
  setIsLoading: (loading: boolean) => void,
  forceFetch: boolean = false // پارامتر جدید برای اجبار به دریافت از سرور
) => {
  setIsLoading(true);
  try {
    if (!forceFetch) {
      const cachedClinics = getCachedClinics();
      if (cachedClinics) {
        setClinics(cachedClinics);
        setError(null);
        setIsLoading(false);
        return;
      }
    }

    localStorage.setItem('authData', JSON.stringify({ token }));
    const response = await getClinics();
    console.log('Fetched clinics:', response);
    setClinics(response.clinics);
    setCachedClinics(response.clinics); // جایگزینی کامل داده‌ها در localStorage
    setError(null);
  } catch (err) {
    console.error('Fetch clinics error:', err);
    if (err && typeof err === 'object' && 'message' in err) {
      setError((err as { message: string }).message);
    } else {
      setError('خطا در بارگذاری کلینیک‌ها');
    }
  } finally {
    setIsLoading(false);
  }
};