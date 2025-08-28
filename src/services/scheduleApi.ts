import axios from 'axios';


export interface AvailableTimesResponse {
  message: string;
  data: {
    id: number | null;
    start_time: string;
    end_time: string;
    services: {
      id: number;
      clinic_id: number;
      thumbnail: string;
      title: string;
      description: string;
      price: number;
      time: number;
      created_at: string;
      updated_at: string;
      discount_price: number;
    }[];
  }[];
}

export interface AppointmentRegisterResponse {
   message: string;
   appointment: {
     user_id: number;
     service_id: number;
     patient_id: number;
     start_date: string;
     end_date: string;
     status: string;
     payment_status: string;
     description: string;
     attachments: string[] | null;
     updated_at: string;
     created_at: string;
     id: number;
   };
 }

const api = axios.create({
  baseURL: 'http://api.niloudarman.ir',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to headers
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

// Get available time slots
export const getAvailableTimes = async (userId: number, serviceId: number, date: string): Promise<AvailableTimesResponse> => {
  try {
    const response = await api.post<AvailableTimesResponse>('/api/panel/schedules/by-user', {
      user_id: userId,
      service_id: serviceId,
      date,
    });
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
    throw new Error('خطای ناشناخته در دریافت زمان‌های موجود');
  }
};

// Register appointment
export const registerAppointment = async (
   appointmentData: {
     user_id: number;
     service_id: number;
     patient_id: number;
     start_date: string;
     end_date: string;
     description: string;
     attachments: string[];
   }
 ): Promise<AppointmentRegisterResponse> => {
  try {
    const response = await api.post<AppointmentRegisterResponse>('/api/panel/appointment/register', appointmentData);
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
    throw new Error('خطای ناشناخته در ثبت نوبت');
  }
};