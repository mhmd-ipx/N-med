import axios from 'axios';
import type {OtpResponse , User , VerifyOtpResponse} from '../types/types'

// ایجاد نمونه axios با تنظیمات پایه
const api = axios.create({
  baseURL: 'https://app.webu.ir/public',
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





// تابع ارسال درخواست OTP
export const requestOtp = async (phone: string): Promise<OtpResponse> => {
  try {
    const response = await api.post<OtpResponse>('/api/auth/request-otp', { phone });
    return response.data;
  } catch (error: any) {
    console.error('Request OTP Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error.response?.data?.message || error.message || 'خطایی در ارسال درخواست OTP رخ داد';
  }
};

// تابع تأیید OTP
export const verifyOtp = async (phone: string, code: string, role: string): Promise<VerifyOtpResponse> => {
  try {
    const response = await api.post<VerifyOtpResponse>('/api/auth/verify-otp', {
      phone,
      code,
      role,
    });
    return response.data;
  } catch (error: any) {
    console.error('Verify OTP Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error.response?.data?.message || error.message || 'خطایی در تأیید OTP رخ داد';
  }
};

// تابع دریافت اطلاعات کاربر از پروفایل
export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await api.get<{ data: User }>('/api/user/profile');
    return response.data.data;
  } catch (error: any) {
    console.error('Get User Profile Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error.response?.data?.message || error.message || 'خطایی در دریافت اطلاعات کاربر رخ داد';
  }
};

// تابع جدید برای دریافت اطلاعات کاربر از /Api/user با توکن ورودی
export const getUser = async (token: string): Promise<User> => {
  try {
    const response = await api.get<User>('/api/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Get User Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error.response?.data?.message || error.message || 'خطایی در دریافت اطلاعات کاربر رخ داد';
  }
};

export default api;