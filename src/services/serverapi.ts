import axios from 'axios';
import type {OtpResponse , User , VerifyOtpResponse , ClinicResponse , UpdateClinicData , updateClinicResponse , deleteClinicResponse} from '../types/types'

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



// تابع برای دریافت لیست کلینیک‌ها
export const getClinics = async (): Promise<ClinicResponse> => {
  try {
    const response = await api.get<ClinicResponse>('/api/clinics');
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('خطا در دریافت لیست کلینیک‌ها: ' + error.message);
    } else {
      throw new Error('خطا در دریافت لیست کلینیک‌ها');
    }
  }
};

// تابع برای به‌روزرسانی کلینیک
export const updateClinic = async (clinicId: number, data: UpdateClinicData): Promise<updateClinicResponse> => {
  try {
    console.log('Sending update request:', { url: `/api/clinics/${clinicId}`, data });
    const response = await api.put<updateClinicResponse>(`/api/clinics/${clinicId}`, data);
    console.log('Update response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Update error:', error.response.data);
      throw new Error(error.response.data.message || 'خطا در به‌روزرسانی کلینیک');
    }
    console.error('Update error:', error);
    throw new Error('خطا در ارتباط با سرور');
  }
};



// تابع برای حذف کلینیک
export const DeleteClinic = async (clinicId: number, token: string): Promise<deleteClinicResponse> => {
  try {
    console.log('Sending delete request:', { url: `/api/clinics/${clinicId}` });
    const response = await api.delete<deleteClinicResponse>(`/api/clinics/${clinicId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Delete response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Delete error:', error.response.data);
      throw new Error(error.response.data.message || 'خطا در حذف کلینیک');
    }
    console.error('Delete error:', error);
    throw new Error('خطا در ارتباط با سرور');
  }
};




// تابع برای ساخت کلینیک
export const CreateClinic = async (data: UpdateClinicData, _token: string): Promise<updateClinicResponse> => {
  try {
    console.log('Sending update request:', { url: `/api/clinics`, data });
    const response = await api.post<updateClinicResponse>(`/api/clinics`, data);
    console.log('Update response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Update error:', error.response.data);
      throw new Error(error.response.data.message || 'خطا در ایجاد کلینیک');
    }
    console.error('Update error:', error);
    throw new Error('خطا در ارتباط با سرور');
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



export default api;