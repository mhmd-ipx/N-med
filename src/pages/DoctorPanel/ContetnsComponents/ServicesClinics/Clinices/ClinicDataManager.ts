import type { Clinic , Operator , UserTime} from '../../../../../types/types.ts';
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



export const cacheClinics = (clinics: Clinic[]) => {
  localStorage.setItem(
    'clinics_cache',
    JSON.stringify({
      clinics,
      timestamp: Date.now(),
    })
  );
};

export const getCachedOperators = (clinicId: number): Operator[] | null => {
  const cachedData = localStorage.getItem(`operators_cache_${clinicId}`);
  if (cachedData) {
    const { operators, timestamp } = JSON.parse(cachedData);
    const cacheAge = Date.now() - timestamp;
    // فرض می‌کنیم کش بعد از 1 ساعت منقضی می‌شود
    if (cacheAge < 60 * 60 * 1000) {
      return operators;
    }
  }
  return null;
};

// ClinicDataManager.ts

// ClinicDataManager.ts

// ذخیره تایم‌ها در کش
export const cacheUserTimes = (userId: number, times: UserTime[]) => {
  try {
    localStorage.setItem(`user_times_cache_${userId}`, JSON.stringify(times));
  } catch (err) {
    console.error('Error caching user times:', err);
  }
};

// بازیابی تایم‌ها از کش
export const getCachedUserTimes = (userId: number): UserTime[] | null => {
  try {
    const cached = localStorage.getItem(`user_times_cache_${userId}`);
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.error('Error retrieving cached user times:', err);
    return null;
  }
};

// سایر توابع مانند getCachedClinics، cacheOperators و ... بدون تغییر باقی می‌مانند
export const cacheOperators = (clinicId: number, operators: Operator[]) => {
  localStorage.setItem(
    `operators_cache_${clinicId}`,
    JSON.stringify({
      operators,
      timestamp: Date.now(),
    })
  );
};
