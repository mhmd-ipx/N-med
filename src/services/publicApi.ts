import axios from 'axios';

// تعریف تایپ‌های مورد نیاز
export interface Pivot {
  doctor_id: number;
  clinic_id: number;
}

export interface Service {
  id: number;
  clinic_id: number;
  thumbnail: string | null;
  title: string;
  description: string;
  price: number;
  time: number;
  created_at: string;
  updated_at: string;
  discount_price: number;
}

export interface Clinic {
  id: number;
  title: string | null;
  address: string;
  services: Service[];
}

export interface User {
  id: number;
  name: string;
  phone: string;
  role: string | null;
}

export interface Doctor {
  id: number;
  user: User;
  specialties: string | null;
  address: string | null;
  bio: string | null;
  avatar: string | null;
  code: string | null;
  status: string;
  clinics: Clinic[];
  created_at: string;
  updated_at: string;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface Links {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface DoctorsResponse {
  data: Doctor[];
  links: Links;
  meta: Meta;
}

export interface Province {
  id: number;
  enname: string;
  faname: string;
  created_at: string;
  updated_at: string;
}

export interface City {
  id: number;
  name: string;
  province_id: number;
  created_at: string;
  updated_at: string;
}

export interface Specialty {
  id: number;
  name: string;
  imageUrl: string | null;
  created_at: string;
  updated_at: string;
}

// ایجاد نمونه axios با تنظیمات پایه بدون توکن
const publicApi = axios.create({
  baseURL: 'https://api.niloudarman.ir',
  headers: {
    'Content-Type': 'application/json',
  },
});

// دریافت لیست پزشکان
export const getDoctors = async (): Promise<DoctorsResponse> => {
  try {
    const response = await publicApi.get<DoctorsResponse>('/api/doctors');
    return response.data;
  } catch (error) {
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as any;
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 400:
            throw new Error('درخواست نامعتبر است (400)');
          case 422:
            throw new Error('داده‌های ورودی نامعتبر هستند (422)');
          case 500:
            throw new Error('خطای سرور (500)');
          default:
            throw new Error(`خطای ناشناخته API: ${axiosError.response.status}`);
        }
      } else if (axiosError.request) {
        throw new Error('هیچ پاسخی از سرور دریافت نشد');
      }
    }
    throw new Error('خطای ناشناخته در دریافت اطلاعات پزشکان');
  }
};

// دریافت لیست استان‌ها
export const getProvinces = async (): Promise<Province[]> => {
  try {
    const response = await publicApi.get<Province[]>('/api/provinces');
    return response.data;
  } catch (error) {
    throw new Error('خطا در دریافت لیست استان‌ها');
  }
};

// دریافت لیست شهرهای یک استان
export const getCitiesByProvince = async (provinceId: number): Promise<City[]> => {
  try {
    const response = await publicApi.get<City[]>(`/api/cities/${provinceId}`);
    return response.data;
  } catch (error) {
    throw new Error(`خطا در دریافت لیست شهرهای استان ${provinceId}`);
  }
};

// دریافت لیست تخصص‌ها
export const getSpecialties = async (): Promise<Specialty[]> => {
  try {
    const response = await publicApi.get<Specialty[]>('/api/specialties');
    return response.data;
  } catch (error) {
    throw new Error('خطا در دریافت لیست تخصص‌ها');
  }
};

// دریافت اطلاعات یک پزشک بر اساس ID
export interface DoctorResponse {
  data: Doctor;
}

export const getDoctorById = async (id: number): Promise<DoctorResponse> => {
  try {
    const response = await publicApi.get<DoctorResponse>(`/api/doctors/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as any;
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 404:
            throw new Error('دکتر مورد نظر یافت نشد');
          case 400:
            throw new Error('درخواست نامعتبر است');
          case 500:
            throw new Error('خطای سرور');
          default:
            throw new Error(`خطای ناشناخته: ${axiosError.response.status}`);
        }
      } else if (axiosError.request) {
        throw new Error('هیچ پاسخی از سرور دریافت نشد');
      }
    }
    throw new Error('خطای ناشناخته در دریافت اطلاعات پزشک');
  }
};