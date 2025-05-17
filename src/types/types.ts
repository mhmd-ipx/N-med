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
  
  export interface User {
    id: number;
    name: string;
    role: 'patient' | 'admin';
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