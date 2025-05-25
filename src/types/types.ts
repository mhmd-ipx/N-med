import {type JSX } from 'react';


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
// رابط برای اطلاعات مرتبط با پزشک
export type DoctorRelatedData = {
  id: number;
  user: {
    id: number;
    name: string;
    phone: string;
  };
  address: string | null;
  bio: string | null;
  avatar: string | null;
  created_at: string;
  updated_at: string;
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
