import axios from 'axios';

// Define the response type
interface Doctor {
  id: number;
  name: string;
  phone: string;
  role: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
  is_admin: number;
  email: string | null;
  card_number: string;
  sheba_number: string;
  related_data: any | null;
}

interface Patient {
  id: number;
  name: string;
  phone: string;
  role: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
  is_admin: number;
  email: string | null;
  card_number: string;
  sheba_number: string;
  related_data: any | null;
}

interface Appointment {
  id: number;
  patient_id: number;
  user_id: number;
  service_id: number;
  start_date: string;
  end_date: string;
  status: string;
  payment_status: string;
  description: string;
  attachments: string;
  doctor_description: string | null;
  created_at: string;
  updated_at: string;
  payment_id: number | null;
  referral_id: number | null;
}

interface Referral {
  id: number;
  appointment_id: number | null;
  referring_doctor_id: number;
  referred_doctor_id: number;
  patient_id: number;
  commission_amount: string;
  commission_status: string;
  referral_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  patient: Patient | null;
  referred_doctor: Doctor;
  referring_doctor: Doctor;
  appointment: Appointment | null;
}

export interface ReferralsResponse {
  referrals: Referral[];
}

export interface UpdateCommissionResponse {
  message: string;
  referral: Referral;
}

export interface CreateReferralByMobileRequest {
  patient_mobile: string;
  to_doctor_id: number;
  notes: string;
}

export interface CreateReferralByMobileResponse {
  message: string;
  referral: Referral;
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://api.niloudarman.ir',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to request headers
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

// Get sent referrals (existing API)
export const getReferrals = async (): Promise<ReferralsResponse> => {
  try {
    const response = await api.get<ReferralsResponse>('/api/referrals/');
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
            const responseData = axiosError.response.data;
            let errorMessage = responseData?.message || 'داده‌های ورودی نامعتبر هستند';
            if (responseData?.errors) {
              const errorDetails = Object.entries(responseData.errors)
                .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
                .join('; ');
              errorMessage += ` (${errorDetails})`;
            }
            throw new Error(errorMessage);
          case 500:
            throw new Error('خطای سرور (500)');
          default:
            throw new Error(`خطای ناشناخته API: ${axiosError.response.status}`);
        }
      } else if (axiosError.request) {
        throw new Error('هیچ پاسخی از سرور دریافت نشد');
      }
    }
    throw new Error('خطای ناشناخته در دریافت اطلاعات ارجاعات ارسالی');
  }
};

// Get received referrals (new API)
export const getReceivedReferrals = async (): Promise<ReferralsResponse> => {
  try {
    const response = await api.get<ReferralsResponse>('/api/referrals/reffred');
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
    throw new Error('خطای ناشناخته در دریافت اطلاعات ارجاعات دریافتی');
  }
};

// Get patient referrals (new API for patient panel)
export const getPatientReferrals = async (): Promise<ReferralsResponse> => {
  try {
    const response = await api.get<ReferralsResponse>('/api/referrals/patient/refferals');
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
    throw new Error('خطای ناشناخته در دریافت اطلاعات ارجاعات بیمار');
  }
};

// Update commission status
export const updateCommissionStatus = async (
  id: number,
  status: 'paid' | 'failed' = 'paid',
  amount?: number,
  appointmentId?: number
): Promise<UpdateCommissionResponse> => {
  try {
    const requestBody: any = { commission_status: status };
    if (amount !== undefined) {
      requestBody.amount = amount;
    }
    if (appointmentId !== undefined) {
      requestBody.appointment_id = appointmentId;
    }
    const response = await api.put<UpdateCommissionResponse>(`/api/referrals/${id}/commission-status`, requestBody);
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
            throw new Error('ارجاع یافت نشد (404)');
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
    throw new Error('خطای ناشناخته در بروزرسانی وضعیت کمیسیون');
  }
};

// Create referral by mobile
export const createReferralByMobile = async (data: CreateReferralByMobileRequest): Promise<CreateReferralByMobileResponse> => {
  console.log('API createReferralByMobile sending data:', data);
  try {
    const response = await api.post<CreateReferralByMobileResponse>('/api/referrals/by-mobile', data);
    return response.data;
  } catch (error) {
    console.error('API Error in createReferralByMobile:', error);
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as any;
      console.log('Error response:', axiosError.response);
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 400:
            throw new Error('درخواست نامعتبر است (400)');
          case 401:
            throw new Error('عدم احراز هویت (401)');
          case 403:
            throw new Error('دسترسی غیرمجاز (403)');
          case 404:
            throw new Error('دکتر یا بیمار یافت نشد (404)');
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
    throw new Error('خطای ناشناخته در ایجاد ارجاع');
  }
};
