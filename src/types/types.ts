import {type JSX, type ReactNode } from 'react';


// تایپ تخصص
export interface Specialty {
  id: number;
  name: string;
  imageUrl: string; 
}
// تایپ به‌روزرسانی‌شده پزشک
export interface Doctor {
  id: number;
  name: string;
  specialtyIds: number[]; 
  cityId: number;
  imageUrl:string;
  availableTimes: { date: string; time: string }[];
}
  export interface Appointment {
    id: number;
    doctorId: number;
    patientName: string;
    date: string;
    time: string;
  }
  
  export interface Specialty {
    id: number;
    name: string;
  }
  

  export interface provinces {
    id: number;
    name: string;
  }

  export interface symptoms {
    id: number;
    name: string;
    slug: string;
    imageUrl: string; 
  }
  

  export interface Services {
    id: number;
    doctorId: number;
    name: string;
    price: number;
    discountedPrice: number;
    imageUrl: string;
  }

// Extended User interface with additional fields
// رابط برای اطلاعات مرتبط با پزشک
export type DoctorRelatedData = {
  id: number;
  user_id: number;
  specialties: number[];
  address: string | null;
  bio: string | null;
  avatar: string | null;
  code: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    phone: string;
  };
};


// رابط برای اطلاعات مرتبط با بیمار
export type PatientRelatedData = {
  id: number;
  user_id: number;
  melli_code: string | null;
  medical_history: string | null;
  insurance_info: string | null;
  attachments: string[];
  created_at: string;
  updated_at: string;
};

// رابط برای اطلاعات مرتبط با منشی
export type SecretaryRelatedData = {
  id: number;
  user_id: number;
  department: string | null;
  manager_id: number | null;
  attachments: string[];
  created_at: string;
  updated_at: string;
};

// رابط برای اطلاعات کاربر
export interface User {
  user: User;
  id: number;
  name: string;
  phone?: string;
  role: 'patient' | 'doctor' | 'secretary';
  related_data?:
    | (User['role'] extends 'doctor' ? DoctorRelatedData : never)
    | (User['role'] extends 'patient' ? PatientRelatedData : never)
    | (User['role'] extends 'secretary' ? SecretaryRelatedData : never);
}

export interface AuthData {
  message: string;
  token: string;
  user: User;
}

export interface UserDataProviderProps {
  children: (props: { user: User | null; token: string | null; isLoading: boolean }) => JSX.Element;
}

export interface UserDataProviderExtendedProps extends UserDataProviderProps {
  role: 'patient' | 'doctor' | 'secretary';
  redirectPath: string;
}



export interface OtpResponse {
  success: boolean;
  message?: string;
}

// رابط برای پاسخ API تأیید OTP
export interface VerifyOtpResponse {
  success: boolean;
  data?: {
    message: string;
    token?: string;
    user: User;
  };
  message?: string;
}


export type ProfileInfoProps = {
  user: {
    id?: number ;
    name?: string;
    email?: string;
  };
  token: string | null | undefined;
};


export interface City {
  id: number;
  province_id: number;
  enname: string;
  faname: string;
  created_at: string;
  updated_at: string;
}

export interface Province {
  id: number;
  enname: string;
  faname: string;
  created_at: string;
  updated_at: string;
}

export interface Clinic {
  id: number;
  name: string;
  address: string;
  phone: string;
  description: string;
  avatar: string | null;
  geo: string;
  city: City | null;
  province: Province | null;
  created_at: string;
  updated_at: string;
}

export interface ClinicResponse {
  data: Clinic[];
}

export interface updateClinicResponse {
  id: number;
  message: string;
  clinic: Clinic;
}

export interface UpdateClinicData {
  name: string;
  address: string;
  phone: string;
  description: string;
  geo: string;
  city_id: number | null;
  province_id: number | null;
}

export interface deleteClinicResponse {
  message: string;
}



export interface Operator {
  operator_id: number;
  user_id: number;
  nickname: string;
  phone: string;
}

export interface OperatorsResponse {
  success: boolean;
  data: Operator[];
}


export interface DetachOperatorResponse {
  success: boolean;
  message: string;
}

export interface CreateAndAssignOperatorResponse {
  success: boolean;
  message: string;
  data: {
    user_id: number;
    operator_id: number;
    clinic_id: number;
  };
}



// تایپ برای اطلاعات کاربر (اوپراتور)
export interface ServiceUser {
  id: number;
  name: string;
  phone: string;
  role: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
  pivot: {
    service_id: number;
    user_id: number;
  };
  related_data: any | null;
}

// تایپ برای هر سرویس
export interface Service {
  id: number;
  clinic: Clinic;
  user: ServiceUser[];
  thumbnail: string | null;
  title: string;
  description: string;
  time: number;
  price: number;
  discount_price: number;
  created_at: string;
  updated_at: string;
}

// تایپ برای پاسخ API سرویس‌ها
export interface ServicesResponse {
  data: Service[];
}


export interface ServiceDeleteResponse {
  message: string;
}



export interface AddServiceToUserResponse {
  success: boolean;
  message: string;
}

export interface CreateServiceResponse {
  data: Service;
}



// Define response types for file operations
export interface FileUploadResponse {
  message: string;
  file_url: string;
  path: string;
}

export interface FileDeleteResponse {
  message: string;
  file_url: string;
  file_path: string;
}


export interface UserTime {
  id: number;
  user_id: number;
  clinic_id: number;
  weekday: string;
  start_date: string;
  end_date: string;
  services: number[];
  created_at: string;
  updated_at: string;
}

// پاسخ API مستقیماً آرایه است
export type UserTimesResponse = UserTime[];

export interface Schedule {
  user_id: number;
  clinic_id: number;
  weekday: string;
  start_date: string;
  end_date: string;
  services: number[];
  updated_at: string;
  created_at: string;
  id: number;
}

export interface CreateSchedulesResponse {
  message: string;
  count: number;
  data: Schedule[];
}

export interface ScheduleTime {
  clinic_id: number;
  start_date: string;
  end_date: string;
  services: number[];
}

export interface ScheduleData {
  weekday: string;
  times: ScheduleTime[];
}

export interface CreateSchedulesRequest {
  user_id: number;
  data: ScheduleData[];
}





export interface CancellationRequest {
  user_id: string;
  start_date: string;
  end_date: string;
  description: string;
}

export interface CancellationResponse {
  id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  description: string;
  created_at: string;
  updated_at: string;
}
export interface UserCancellation {
  id: number;
  name: string;
  phone: string;
  role: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
  related_data: any | null;
}

export interface Cancellation {
  id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: UserCancellation;
}

export interface CancellationsResponse {
  data: Cancellation[];
}


// Define the response type
export interface DoctorDashboardResponse {
  clinics_count: number;
  services_count: number;
  appointments_count: number;
  referrals_count: number;
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


// Define Appointment Response type
export type AppointmentsResponse = Appointment[];

// تایپ برای تخصص‌ها
export interface Specialty {
  id: number;
  thumbnail: string | null;
  title: string;
  description: string;
  slug: string;
  seo_id: number | null;
  created_at: string;
  updated_at: string;
}

// تایپ برای درخواست ویرایش پروفایل دکتر
export interface DoctorProfileUpdateRequest {
  name: string;
  phone: string;
  specialties: number[];
  address: string;
  bio: string;
  avatar: string;
  code: string;
}

// تایپ برای پاسخ ویرایش پروفایل دکتر
export interface DoctorProfileUpdateResponse {
  message: string;
  data: {
    id: number;
    user_id: number;
    specialties: number[];
    address: string;
    bio: string;
    avatar: string;
    code: string;
    status: string;
    created_at: string;
    updated_at: string;
    user: {
      id: number;
      name: string;
      phone: string;
      role: string | null;
      is_active: number;
      created_at: string;
      updated_at: string;
      related_data: any | null;
    };
  };
}

// تایپ برای پاسخ API تخصص‌ها
export type SpecialtiesResponse = Specialty[];

// تایپ برای درخواست ویرایش پروفایل بیمار
export interface PatientProfileUpdateRequest {
  name: string;
  phone: string;
  gender: string;
  national_code: string;
  birth_year: number;
}

// تایپ برای پاسخ ویرایش پروفایل بیمار
export interface PatientProfileUpdateResponse {
  message: string;
  data: {
    id: number;
    user_id: number;
    national_code: string;
    birth_year: number;
    gender: string;
    created_at: string;
    updated_at: string;
    user: {
      id: number;
      name: string;
      phone: string;
      role: string | null;
      is_active: number;
      created_at: string;
      updated_at: string;
      related_data: any | null;
    };
  };
}