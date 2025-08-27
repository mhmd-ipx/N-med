import axios from 'axios';


// ایجاد نمونه axios با تنظیمات پایه
const api = axios.create({
  baseURL: 'http://api.niloudarman.ir',
  headers: {
    'Content-Type': 'application/json',
  },
});








// اضافه کردن توکن به هدر تمام درخواست‌ها
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('authData');
    if (authData) {
      const parsedData: { token: string } = JSON.parse(authData);
      config.headers.Authorization = `Bearer ${parsedData.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// types/appointments.ts
export interface Clinic {
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
}

export interface Service {
  id: number;
  clinic_id: number;
  thumbnail: string;
  title: string;
  description: string | null;
  price: number;
  time: number;
  created_at: string;
  updated_at: string;
  discount_price: number;
  clinic: Clinic;
}

export interface User {
  id: number;
  name: string;
  phone: string;
  role: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
  related_data: any | null;
}

export interface Patient {
  id: number;
  user_id: number;
  national_code: string | null;
  birth_year: number | null;
  gender: string;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface Appointment {
   id: number;
   patient_id: number;
   user_id: number;
   service_id: number;
   start_date: string;
   end_date: string;
   status: "waiting" | "canceled" | "finished";
   payment_status: string;
   description: string;
   attachments: string; // رشته JSON که باید پارس شود
   doctor_description: string | null;
   created_at: string;
   updated_at: string;
   payment_id: number | null;
   referral_id: number | null;
   patient: Patient | null;
   service: Service;
 }

export type AppointmentsResponse = Appointment[];


// Get doctor appointments
export const getDoctorAppointments = async (): Promise<AppointmentsResponse> => {
  try {
    const response = await api.get<AppointmentsResponse>('/api/doctors/appointments');
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
    throw new Error('خطای ناشناخته در دریافت اطلاعات نوبت‌ها');
  }
};

// Update appointment status
export interface UpdateAppointmentRequest {
  status?: "waiting" | "canceled" | "finished";
  date?: string;
  start_time?: string;
  end_time?: string;
  service_id?: number;
}

export const updateAppointmentStatus = async (
  appointmentId: number,
  updateData: UpdateAppointmentRequest
): Promise<{ message: string }> => {
  try {
    const response = await api.put<{ message: string }>(`/api/panel/appointments/${appointmentId}`, updateData);
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
          case 404:
            throw new Error('نوبت یافت نشد (404)');
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
    throw new Error('خطای ناشناخته در بروزرسانی وضعیت نوبت');
  }
};

