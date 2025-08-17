import axios from 'axios';
import { useEffect, useState } from 'react';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

// Create Axios instance with base configuration
const api = axios.create({
  baseURL: 'http://api.niloudarman.ir',
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

// TypeScript Interfaces
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
  clinic: Clinic;
  user: any[];
  thumbnail: string;
  title: string;
  description: string;
  time: number;
  price: number;
  discount_price: number;
  created_at: string;
  updated_at: string;
  doctorId?: number; // Implicitly assumed for doctor linking
}

export interface Doctor {
  id: number;
  name: string;
  imageUrl: string;
  specialtyIds: number[];
  cityId: number;
  availableTimes: string[];
}

export interface Province {
  id: number;
  enname: string;
  faname: string;
  created_at: string;
  updated_at: string;
}

// API Functions
export const getServices = async (): Promise<Service[]> => {
  try {
    const response = await api.get<{ data: Service[] }>('/api/services');
    return response.data.data.map(service => ({
      ...service,
      doctorId: 2 // Hardcoding to first operator_id from /api/clinics/1/operators
    }));
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
    throw new Error('خطای ناشناخته در دریافت خدمات');
  }
};

export const getDoctors = async (clinicId: number = 1): Promise<Doctor[]> => {
  try {
    const response = await api.get<{ success: boolean; data: { operator_id: number; user_id: number; nickname: string; phone: string }[] }>(`/api/clinics/${clinicId}/operators`);
    const operator = response.data.data[0]; // Use only the first operator
    return [{
      id: operator.operator_id,
      name: operator.nickname,
      imageUrl: 'https://img.freepik.com/premium-vector/vector-doctor-medical-hospital-health-medicine-illustration-care-man-clinic-people-profes_1158065-1370.jpg',
      specialtyIds: [],
      cityId: 66, // Hardcoded from clinic.city_id
      availableTimes: []
    }];
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
    throw new Error('خطای ناشناخته در دریافت لیست پزشکان');
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

// SingleServiceCard Component
interface SingleServiceCardProps {
  service: Service;
  doctor: Doctor | undefined;
  province: Province | undefined;
}

const SingleServiceCard = ({ service, doctor, province }: SingleServiceCardProps) => {
  if (!doctor) return null;

  const discountAmount = service.price - service.discount_price;
  const discountPercentage = service.discount_price > 0 ? ((1 - service.discount_price / service.price) * 100).toFixed(0) : '0';

  return (
    <Link to={`/service/${service.id}`}>
      <div className="flex w-full flex-col bg-white border border-light hover:bg-light text-black rounded-2xl p-3 items-center justify-between shadow-lg">
        <div className="flex gap-4 w-full">
          <img src={service.thumbnail} alt={service.title} className="w-20 h-20 object-cover rounded-xl" />
          <div className="flex flex-1 flex-col justify-between">
            <h3 className="text-base font-bold">{service.title}</h3>
            <div className="flex justify-between mt-2">
              <div className="flex items-center justify-center gap-2">
                <img src={doctor.imageUrl} alt={doctor.name} className="w-9 h-9 object-cover rounded-full" />
                <p className="text-sm">{doctor.name}</p>
              </div>
              <div className="flex flex-row items-center text-sm gap-1 text-gray-500">
                <HiOutlineLocationMarker className="text-lg" />
                <p>{province ? province.faname : 'نامشخص'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full h-2 my-2">
          <div className="absolute top-1/2 w-full border-t border-light"></div>
        </div>
        <div className="flex justify-between w-full items-center">
          <Button
            variant="outline"
            iconAlignment="start"
            size="sm"
            className="text-sm px-4"
          >
            نوتاش رزرو
          </Button>
          <div>
            {service.discount_price > 0 && discountAmount > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs line-through">{service.price.toLocaleString()}</span>
                <div className="flex items-center">
                  <span className="font-bold text-xl">{service.discount_price.toLocaleString()}</span>
                  <span className="text-sm mr-1">تومان</span>
                </div>
                <span className="bg-red-500 rounded-2xl p-1 px-2 text-white">{discountPercentage}%</span>
              </div>
            ) : (
              <div>
                <span className="font-bold text-xl">{service.price.toLocaleString()}</span>
                <span className="text-sm mr-1">تومان</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// ServiceCard Component
const ServiceCard = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesData, doctorsData, provincesData] = await Promise.all([
          getServices(),
          getDoctors(),
          getProvinces(),
        ]);

        console.log('Services:', servicesData);
        console.log('Doctors:', doctorsData);
        console.log('Provinces:', provincesData);

        if (Array.isArray(servicesData)) setServices(servicesData);
        if (Array.isArray(doctorsData)) setDoctors(doctorsData);
        if (Array.isArray(provincesData)) setProvinces(provincesData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>در حال بارگذاری...</div>;
  if (services.length === 0) return <div>داده‌ای برای نمایش وجود ندارد</div>;

  return (
    <div className="gap-4 grid grid-cols-3">
      {services.slice(0, 6).map((service) => {
        const doctor = doctors.find((doc) => String(doc.id) === String(service.doctorId)) || {
          id: 0,
          name: 'نامشخص',
          imageUrl: '/default.jpg',
          specialtyIds: [],
          cityId: 0,
          availableTimes: []
        };
        const province = provinces.find((prov) => String(prov.id) === String(service.clinic.province_id)) || {
          id: 0,
          faname: 'نامشخص',
          enname: '',
          created_at: '',
          updated_at: ''
        };

        return (
          <SingleServiceCard
            key={service.id}
            service={service}
            doctor={doctor}
            province={province}
          />
        );
      })}
    </div>
  );
};

export default ServiceCard;