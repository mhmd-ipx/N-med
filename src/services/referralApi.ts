import axios from 'axios';
import type { User, Appointment } from '../types/types';
import api from './serverapi';

// Define types for referral
interface Referral {
  id: number;
  appointment_id: number;
  referring_doctor_id: number;
  referred_doctor_id: number;
  patient_id: number;
  commission_amount: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface CreateReferralRequest {
  patient_id: number;
  referred_doctor_id: number;
  appointment_id: number;
  notes: string;
}

interface CreateReferralResponse {
  message: string;
  referral: Referral;
}

// Define types for doctors
interface ClinicPivot {
  doctor_id: number;
  clinic_id: number;
}

interface Clinic {
  id: number;
  name: string;
  address: string;
  phone: string;
  description: string | null;
  geo: string;
  province_id: number;
  city_id: number;
  created_at: string;
  updated_at: string;
  pivot: ClinicPivot;
}

interface DoctorUser {
  id: number;
  name: string;
  phone: string;
  role: string | null;
}

export interface Doctor {
  id: number;
  user: DoctorUser;
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

export interface DoctorsResponse {
  data: Doctor[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
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
  };
}

// Create referral API
export const createReferral = async (data: CreateReferralRequest): Promise<CreateReferralResponse> => {
  try {
    const response = await api.post<CreateReferralResponse>('/api/referrals', data);
    return response.data;
  } catch (error) {
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as any;
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 400:
            throw new Error('درخواست نامعتبر است (400)');
          case 401:
            throw new Error('عدم احراز هویت (401)');
          case 403:
            throw new Error('دسترسی غیرمجاز (403)');
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
    throw new Error('خطای ناشناخته در ثبت ارجاع');
  }
};

// Get doctors API
export const getDoctors = async (): Promise<DoctorsResponse> => {
  try {
    const response = await api.get<DoctorsResponse>('/api/doctors');
    return response.data;
  } catch (error) {
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as any;
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 400:
            throw new Error('درخواست نامعتبر است (400)');
          case 401:
            throw new Error('عدم احراز هویت (401)');
          case 403:
            throw new Error('دسترسی غیرمجاز (403)');
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