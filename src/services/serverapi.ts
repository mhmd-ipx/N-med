import axios from 'axios';
import type {
  City ,
  Province ,
  OtpResponse ,
  User ,
  VerifyOtpResponse , 
  ClinicResponse , 
  UpdateClinicData , 
  updateClinicResponse , 
  deleteClinicResponse , 
  OperatorsResponse ,
  DetachOperatorResponse ,
  CreateAndAssignOperatorResponse ,
  ServicesResponse ,
  ServiceDeleteResponse ,
  CreateServiceResponse ,
  AddServiceToUserResponse } from '../types/types'

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


// تابع برای دریافت لیست سرویس‌ها
export const getServices = async (): Promise<ServicesResponse> => {
  try {
    const response = await api.get<ServicesResponse>('/api/services');
    if (!response.data || !response.data.data) {
      throw new Error('پاسخ API داده‌ی معتبر ندارد');
    }
    return response.data;
  } catch (error) {
    console.error('خطا در دریافت لیست سرویس‌ها:', error);
    if (error instanceof Error) {
      if ('response' in error) {
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
              throw new Error('سرویس‌ها یافت نشدند (404)');
            case 500:
              throw new Error('خطای سرور (500)');
            default:
              throw new Error(`خطای ناشناخته API: ${axiosError.response.status}`);
          }
        } else if (axiosError.request) {
          throw new Error('هیچ پاسخی از سرور دریافت نشد');
        }
      }
      throw new Error('خطا در دریافت لیست سرویس‌ها: ' + error.message);
    }
    throw new Error('خطای ناشناخته در دریافت لیست سرویس‌ها');
  }
};


// تابع برای حذف سرویس
export const deleteService = async (serviceId: number): Promise<ServiceDeleteResponse> => {
  try {
    const response = await api.delete<ServiceDeleteResponse>(`/api/services/${serviceId}`);
    if (!response.data) {
      throw new Error('پاسخ API داده‌ی معتبر ندارد');
    }
    return response.data;
  } catch (error) {
    console.error(`خطا در حذف سرویس با شناسه ${serviceId}:`, error);
    if (error instanceof Error) {
      if ('response' in error) {
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
              throw new Error('سرویس یافت نشد (404)');
            case 500:
              throw new Error('خطای سرور (500)');
            default:
              throw new Error(`خطای ناشناخته API: ${axiosError.response.status}`);
          }
        } else if (axiosError.request) {
          throw new Error('هیچ پاسخی از سرور دریافت نشد');
        }
      }
      throw new Error(`خطا در حذف سرویس: ${error.message}`);
    }
    throw new Error('خطای ناشناخته در حذف سرویس');
  }
};



// تابع برای افزودن سرویس به کاربر
export const addServiceToUser = async (userId: number, serviceId: number): Promise<AddServiceToUserResponse> => {
  try {
    const response = await api.post<AddServiceToUserResponse>('/api/user/add-service', {
      user_id: userId,
      service_id: serviceId,
    });
    if (!response.data) {
      throw new Error('پاسخ API داده‌ی معتبر ندارد');
    }
    return response.data;
  } catch (error) {
    console.error(`خطا در افزودن سرویس به کاربر ${userId}:`, error);
    if (error instanceof Error) {
      if ('response' in error) {
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
              throw new Error('کاربر یا سرویس یافت نشد (404)');
            case 500:
              throw new Error('خطای سرور (500)');
            default:
              throw new Error(`خطای ناشناخته API: ${axiosError.response.status}`);
          }
        } else if (axiosError.request) {
          throw new Error('هیچ پاسخی از سرور دریافت نشد');
        }
      }
      throw new Error(`خطا در افزودن سرویس به کاربر: ${error.message}`);
    }
    throw new Error('خطای ناشناخته در افزودن سرویس به کاربر');
  }
};

// تابع برای ایجاد سرویس جدید
export const createService = async (serviceData: {
  clinic_id: number;
  thumbnail: string;
  title: string;
  description: string;
  price: number;
  discount_price: number;
  time: number;
  user_id: number;
}): Promise<CreateServiceResponse> => {
  try {
    const response = await api.post<CreateServiceResponse>('/api/services', serviceData);
    if (!response.data || !response.data.data) {
      throw new Error('پاسخ API داده‌ی معتبر ندارد');
    }
    return response.data;
  } catch (error) {
    console.error('خطا در ایجاد سرویس:', error);
    if (error instanceof Error) {
      if ('response' in error) {
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
      throw new Error(`خطا در ایجاد سرویس: ${error.message}`);
    }
    throw new Error('خطای ناشناخته در ایجاد سرویس');
  }
};

// تابع برای دریافت لیست اوپراتورهای یک کلینیک
export const getOperators = async (clinicId: number): Promise<OperatorsResponse> => {
  try {
    const response = await api.get<OperatorsResponse>(`/api/clinics/${clinicId}/operators`);
    if (!response.data || !response.data.data) {
      throw new Error('پاسخ API داده‌ی معتبر ندارد');
    }
    return response.data;
  } catch (error) {
    console.error('خطا در دریافت لیست اوپراتورها:', error);
    if (error instanceof Error) {
      if ('response' in error) {
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
              throw new Error('اوپراتورها یافت نشدند (404)');
            case 500:
              throw new Error('خطای سرور (500)');
            default:
              throw new Error(`خطای ناشناخته API: ${axiosError.response.status}`);
          }
        } else if (axiosError.request) {
          throw new Error('هیچ پاسخی از سرور دریافت نشد');
        }
      }
      throw new Error('خطا در دریافت لیست اوپراتورها: ' + error.message);
    }
    throw new Error('خطای ناشناخته در دریافت لیست اوپراتورها');
  }
};

// تابع برای جدا کردن اوپراتور از کلینیک
export const detachOperator = async (clinicId: number, operatorId: number): Promise<DetachOperatorResponse> => {
  try {
    const response = await api.post<DetachOperatorResponse>('/api/operators/detach', {
      clinic_id: clinicId,
      operator_id: operatorId,
    });
    if (!response.data) {
      throw new Error('پاسخ API داده‌ی معتبر ندارد');
    }
    return response.data;
  } catch (error) {
    console.error('خطا در جدا کردن اوپراتور:', error);
    if (error instanceof Error) {
      if ('response' in error) {
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
              throw new Error('اوپراتور یا کلینیک یافت نشد (404)');
            case 500:
              throw new Error('خطای سرور (500)');
            default:
              throw new Error(`خطای ناشناخته API: ${axiosError.response.status}`);
          }
        } else if (axiosError.request) {
          throw new Error('هیچ پاسخی از سرور دریافت نشد');
        }
      }
      throw new Error('خطا در جدا کردن اوپراتور: ' + error.message);
    }
    throw new Error('خطای ناشناخته در جدا کردن اوپراتور');
  }
};

// تابع برای ایجاد و اختصاص اوپراتور به کلینیک
export const createAndAssignOperator = async (
  clinicId: number,
  name: string,
  phone: string
): Promise<CreateAndAssignOperatorResponse> => {
  try {
    const response = await api.post<CreateAndAssignOperatorResponse>('/api/operators/create-and-assign', {
      clinic_id: clinicId,
      name,
      phone,
    });
    if (!response.data) {
      throw new Error('پاسخ API داده‌ی معتبر ندارد');
    }
    return response.data;
  } catch (error) {
    console.error('خطا در ایجاد و اختصاص اوپراتور:', error);
    if (error instanceof Error) {
      if ('response' in error) {
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
              throw new Error('کلینیک یافت نشد (404)');
            case 500:
              throw new Error('خطای سرور (500)');
            default:
              throw new Error(`خطای ناشناخته API: ${axiosError.response.status}`);
          }
        } else if (axiosError.request) {
          throw new Error('هیچ پاسخی از سرور دریافت نشد');
        }
      }
      throw new Error('خطا در ایجاد و اختصاص اوپراتور: ' + error.message);
    }
    throw new Error('خطای ناشناخته در ایجاد و اختصاص اوپراتور');
  }
};

export const getProvinces = async (): Promise<Province[]> => {
  try {
    const response = await api.get<Province[]>('/api/provinces');
    return response.data;
  } catch (error) {
    console.error('خطا در دریافت لیست استان‌ها:', error);
    throw new Error('خطا در دریافت لیست استان‌ها');
  }
};
// تابع برای دریافت لیست شهرهای یک استان
export const getCitiesByProvince = async (provinceId: number): Promise<City[]> => {
  try {
    const response = await api.get<City[]>(`/api/cities/${provinceId}`);
    return response.data;
  } catch (error) {
    throw new Error(`خطا در دریافت لیست شهرهای استان ${provinceId}`);
  }
};

// تابع برای دریافت لیست کلینیک‌ها
export const getClinics = async (): Promise<ClinicResponse> => {
  try {
    const response = await api.get<ClinicResponse>('/api/clinics');
    if (!response.data || !response.data.data) {

      throw new Error('پاسخ API داده‌ی معتبر ندارد');
    }
    return response.data;
  } catch (error) {
    console.error('خطا در دریافت لیست کلینیک‌ها:', error);
    if (error instanceof Error) {
      if ('response' in error) {
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
              throw new Error('کلینیک‌ها یافت نشدند (404)');
            case 500:
              throw new Error('خطای سرور (500)');
            default:
              throw new Error(`خطای ناشناخته API: ${axiosError.response.status}`);
          }
        } else if (axiosError.request) {
          throw new Error('هیچ پاسخی از سرور دریافت نشد');
        }
      }
      throw new Error('خطا در دریافت لیست کلینیک‌ها: ' + error.message);
    }
    throw new Error('خطای ناشناخته در دریافت لیست کلینیک‌ها');
  }
};




// تابع برای به‌روزرسانی کلینیک
export const updateClinic = async (clinicId: number, data: UpdateClinicData, token: string): Promise<updateClinicResponse> => {
  try {
    const response = await api.put<updateClinicResponse>(`/api/clinics/${clinicId}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'خطا در به‌روزرسانی کلینیک');
    }
    throw new Error('خطا در ارتباط با سرور');
  }
};



// تابع برای حذف کلینیک
export const DeleteClinic = async (clinicId: number, token: string): Promise<deleteClinicResponse> => {
  try {
    const response = await api.delete<deleteClinicResponse>(`/api/clinics/${clinicId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Delete error:', error.response.data);
      throw new Error(error.response.data.message || 'خطا در حذف کلینیک');
    }
    throw new Error('خطا در ارتباط با سرور');
  }
};




// تابع برای ساخت کلینیک
export const CreateClinic = async (data: UpdateClinicData, _token: string): Promise<updateClinicResponse> => {
  try {
    const response = await api.post<updateClinicResponse>(`/api/clinics`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'خطا در ایجاد کلینیک');
    }
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