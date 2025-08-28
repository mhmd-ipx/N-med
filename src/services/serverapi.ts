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
  AddServiceToUserResponse  ,
  FileDeleteResponse ,
  FileUploadResponse ,
  UserTimesResponse ,
  CreateSchedulesResponse ,
  CreateSchedulesRequest,
  DoctorDashboardResponse,
  Appointment,
  AppointmentsResponse,
  Specialty,
  SpecialtiesResponse,
  DoctorProfileUpdateRequest,
  DoctorProfileUpdateResponse,
  PatientProfileUpdateRequest,
  PatientProfileUpdateResponse} from '../types/types'

  import type {  CancellationRequest ,
  CancellationsResponse,
  CancellationResponse} from '../types/cancelltypes'

// ایجاد نمونه axios با تنظیمات پایه
const api = axios.create({
  baseURL: 'https://api.niloudarman.ir',
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

// Get patient appointments
export const getPatientAppointments = async (): Promise<AppointmentsResponse> => {
  try {
    const response = await api.get<AppointmentsResponse>('/api/patient/appointments');
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
    throw new Error('خطای ناشناخته در دریافت اطلاعات نوبت‌های بیمار');
  }
};

// Cancel patient appointment
export const cancelPatientAppointment = async (appointmentId: number): Promise<any> => {
  try {
    const response = await api.put(`/api/panel/appointments/${appointmentId}`, {
      status: 'canceled'
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
    throw new Error('خطای ناشناخته در لغو نوبت');
  }
};



// Get doctor dashboard data
export const getDoctorDashboard = async (): Promise<DoctorDashboardResponse> => {
  try {
    const response = await api.get<DoctorDashboardResponse>('/api/doctors/dashboard');
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
    throw new Error('خطای ناشناخته در دریافت اطلاعات داشبورد');
  }
};

//ایجاد کنسلی 
export const createCancellation = async (
  payload: CancellationRequest
): Promise<CancellationResponse> => {

  try {
    const response = await api.post<CancellationResponse>('/api/cancellations', payload);
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
    throw new Error('خطای ناشناخته در ایجاد کنسلی');
  }
};

// دریافت کنسلی‌ها برای یک کاربر (GET)
export const getCancellations = async (
  userId: number
): Promise<CancellationsResponse> => {
  try {
    const response = await api.get<CancellationsResponse>(`/api/cancellations?user_id=${userId}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as any;
      if (axiosError.response) {
        console.debug('جزئیات خطای سرور:', {
          status: axiosError.response.status,
          data: axiosError.response.data,
        });
        switch (axiosError.response.status) {
          case 400:
            throw new Error('درخواست نامعتبر است (400)');
          case 401:
            throw new Error('عدم احراز هویت (401)');
          case 403:
            throw new Error('دسترسی غیرمجاز (403)');
          case 404:
            throw new Error('کنسلی یافت نشد (404)');
          case 500:
            throw new Error('خطای سرور (500)');
          default:
            throw new Error(`خطای ناشناخته API: ${axiosError.response.status}`);
        }
      } else if (axiosError.request) {
        throw new Error('هیچ پاسخی از سرور دریافت نشد');
      }
    }
    throw new Error('خطای ناشناخته در دریافت کنسلی‌ها');
  }
};


// به‌روزرسانی کنسلی
export const updateCancellation = async (
  cancelId: number,
  payload: CancellationRequest
): Promise<CancellationResponse> => {
  try {
    const response = await api.put<CancellationResponse>(`/api/cancellations/${cancelId}`, payload);
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
            throw new Error('کنسلی یافت نشد (404)');
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
    throw new Error('خطای ناشناخته در به‌روزرسانی کنسلی');
  }
};

// حذف کنسلی
export const deleteCancellation = async (
  cancelId: number
): Promise<void> => {
  try {
    await api.delete(`/api/cancellations/${cancelId}`);
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
            throw new Error('کنسلی یافت نشد (404)');
          case 500:
            throw new Error('خطای سرور (500)');
          default:
            throw new Error(`خطای ناشناخته API: ${axiosError.response.status}`);
        }
      } else if (axiosError.request) {
        throw new Error('هیچ پاسخی از سرور دریافت نشد');
      }
    }
    throw new Error('خطای ناشناخته در حذف کنسلی');
  }
};

//ایجاد زمانبندی
export const createSchedules = async (
  payload: CreateSchedulesRequest
): Promise<CreateSchedulesResponse> => {
  try {
    const response = await api.post<CreateSchedulesResponse>('/api/panel/schedules', payload);
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
    throw new Error('خطای ناشناخته در ایجاد زمان‌بندی‌ها');
  }
};

// ویرایش زمانبندی
export const updateSchedule = async (
  id: string,
  payload: CreateSchedulesRequest
): Promise<CreateSchedulesResponse> => {
  try {
    const response = await api.put<CreateSchedulesResponse>(`/api/panel/schedules/${id}`, payload);
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
            throw new Error('زمانبندی مورد نظر یافت نشد (404)');
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
    throw new Error('خطای ناشناخته در ویرایش زمان‌بندی');
  }
};

//دریافت زمان بندی های یوزر
export const getUserTimes = async (userId: number): Promise<UserTimesResponse> => {
  try {
    const response = await api.get<UserTimesResponse>(`/api/user/times?user_id=${userId}`);
    // بررسی اینکه پاسخ یک آرایه است
    if (!Array.isArray(response.data)) {
      throw new Error('پاسخ API آرایه نیست');
    }

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
            return []; // برای 404، آرایه خالی برگردان تا "بدون زمان‌بندی" نمایش داده شود
          case 422:
            return []; // برای 422، آرایه خالی برگردان تا "بدون زمان‌بندی" نمایش داده شود
          case 500:
            throw new Error('خطای سرور (500)');
          default:
            throw new Error(`خطای ناشناخته API: ${axiosError.response.status}`);
        }
      } else if (axiosError.request) {
        throw new Error('هیچ پاسخی از سرور دریافت نشد');
      }
    }
    throw new Error('خطای ناشناخته در دریافت تایم‌های کاربر');
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
clinicId: number, name: string, phone: string, token: string): Promise<CreateAndAssignOperatorResponse> => {
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



// تابع برای به‌روزرسانی سرویس
export const updateService = async (serviceId: number, serviceData: {
  clinic_id: number;
  thumbnail: string;
  title: string;
  description: string;
  price: number;
  discount_price: number;
  time: number;
}): Promise<CreateServiceResponse> => {
  try {
    const response = await api.put<CreateServiceResponse>(`/api/services/${serviceId}`, serviceData);
    if (!response.data || !response.data.data) {
      throw new Error('پاسخ API داده‌ی معتبر ندارد');
    }
    return response.data;
  } catch (error) {
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
      throw new Error(`خطا در به‌روزرسانی سرویس: ${error.message}`);
    }
    throw new Error('خطای ناشناخته در به‌روزرسانی سرویس');
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
}): Promise<CreateServiceResponse> => {
  try {
    const response = await api.post<CreateServiceResponse>('/api/services', serviceData);
    if (!response.data || !response.data.data) {
      throw new Error('پاسخ API داده‌ی معتبر ندارد');
    }
    return response.data;
  } catch (error) {
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


// تابع برای دریافت لیست سرویس‌ها
export const getServices = async (): Promise<ServicesResponse> => {
  try {
    const response = await api.get<ServicesResponse>('/api/services');
    if (!response.data || !response.data.data) {
      throw new Error('پاسخ API داده‌ی معتبر ندارد');
    }
    return response.data;
  } catch (error) {
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

// Upload file
export const uploadFile = async (file: File): Promise<FileUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<FileUploadResponse>('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (!response.data || !response.data.file_url) {
      throw new Error('پاسخ API داده‌ی معتبر ندارد');
    }
    
    // Construct display URL
    response.data.file_url = `https://api.niloudarman.ir/storage/${response.data.path}`;
    
    return response.data;
  } catch (error) {
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
            case 500:
              throw new Error('خطای سرور (500)');
            default:
              throw new Error(`خطای ناشناخته API: ${axiosError.response.status}`);
          }
        } else if (axiosError.request) {
          throw new Error('هیچ پاسخی از سرور دریافت نشد');
        }
      }
      throw new Error('خطا در آپلود فایل: ' + error.message);
    }
    throw new Error('خطای ناشناخته در آپلود فایل');
  }
};

// Delete file
export const deleteFile = async (fileUrl: string): Promise<FileDeleteResponse> => {
  try {
    const response = await api.delete<FileDeleteResponse>('/api/files/delete', {
      data: { file_url: fileUrl },
    });
    
    if (!response.data || !response.data.file_url) {
      throw new Error('پاسخ API داده‌ی معتبر ندارد');
    }
    
    return response.data;
  } catch (error) {
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
              throw new Error('فایل یافت نشد (404)');
            case 500:
              throw new Error('خطای سرور (500)');
            default:
              throw new Error(`خطای ناشناخته API: ${axiosError.response.status}`);
          }
        } else if (axiosError.request) {
          throw new Error('هیچ پاسخی از سرور دریافت نشد');
        }
      }
      throw new Error('خطا در حذف فایل: ' + error.message);
    }
    throw new Error('خطای ناشناخته در حذف فایل');
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


export const getProvinces = async (): Promise<Province[]> => {
  try {
    const response = await api.get<Province[]>('/api/provinces');
    return response.data;
  } catch (error) {
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















// Get specialties list
export const getSpecialties = async (): Promise<SpecialtiesResponse> => {
  try {
    const response = await api.get<SpecialtiesResponse>('/api/specialties');
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
          case 500:
            throw new Error('خطای سرور (500)');
          default:
            throw new Error(`خطای ناشناخته API: ${axiosError.response.status}`);
        }
      } else if (axiosError.request) {
        throw new Error('هیچ پاسخی از سرور دریافت نشد');
      }
    }
    throw new Error('خطای ناشناخته در دریافت تخصص‌ها');
  }
};

// Update doctor profile
export const updateDoctorProfile = async (profileData: DoctorProfileUpdateRequest): Promise<DoctorProfileUpdateResponse> => {
  try {
    const response = await api.put<DoctorProfileUpdateResponse>('/api/doctors/profile', profileData);
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
    throw new Error('خطای ناشناخته در به‌روزرسانی پروفایل');
  }
};

// Update patient profile
export const updatePatientProfile = async (profileData: PatientProfileUpdateRequest): Promise<PatientProfileUpdateResponse> => {
  try {
    const response = await api.put<PatientProfileUpdateResponse>('/api/patient/profile', profileData);
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
    throw new Error('خطای ناشناخته در به‌روزرسانی پروفایل بیمار');
  }
};

export default api;