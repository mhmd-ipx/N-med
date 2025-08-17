import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlineCurrencyDollar } from 'react-icons/hi';
import Button from '../components/ui/Button';
import { DatePicker } from 'jalaali-react-date-picker';
import 'jalaali-react-date-picker/lib/styles/index.css';

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
  (error) => Promise.reject(error)
);

// TypeScript Interfaces
interface Clinic {
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

interface Service {
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
  doctorId?: number;
}

interface Doctor {
  id: number;
  name: string;
  imageUrl: string;
  specialtyIds: number[];
  cityId: number;
  availableTimes: string[];
}

interface Province {
  id: number;
  enname: string;
  faname: string;
  created_at: string;
  updated_at: string;
}

// API Functions
const getServiceById = async (id: number): Promise<Service> => {
  try {
    const response = await api.get<{ data: Service[] }>('/api/services');
    const service = response.data.data.find(s => s.id === id);
    if (!service) throw new Error('Service not found');
    return { ...service, doctorId: 2 };
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
    throw new Error('خطای ناشناخته در دریافت سرویس');
  }
};

const getDoctors = async (clinicId: number = 1): Promise<Doctor[]> => {
  try {
    const response = await api.get<{ success: boolean; data: { operator_id: number; user_id: number; nickname: string; phone: string }[] }>(`/api/clinics/${clinicId}/operators`);
    const operator = response.data.data[0];
    return [{
      id: operator.operator_id,
      name: operator.nickname,
      imageUrl: 'https://img.freepik.com/premium-vector/vector-doctor-medical-hospital-health-medicine-illustration-care-man-clinic-people-profes_1158065-1370.jpg',
      specialtyIds: [],
      cityId: 66,
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

const getProvinces = async (): Promise<Province[]> => {
  try {
    const response = await api.get<Province[]>('/api/provinces');
    return response.data;
  } catch (error) {
    throw new Error('خطا در دریافت لیست استان‌ها');
  }
};

// Service Detail Component
const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [province, setProvince] = useState<Province | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<{ year: number; month: number; day: number } | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [serviceData, doctorsData, provincesData] = await Promise.all([
          getServiceById(Number(id)),
          getDoctors(),
          getProvinces(),
        ]);

        setService(serviceData);
        setDoctor(doctorsData[0] || null);
        setProvince(provincesData.find(prov => String(prov.id) === String(serviceData.clinic.province_id)) || null);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDateSelect = (date: { year: number; month: number; day: number } | null) => {
    setSelectedDate(date);
    if (date) {
      setAvailableTimes(['09:00', '10:30', '14:00', '16:30']);
      setSelectedTime(null);
    } else {
      setAvailableTimes([]);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      setBookingStatus(`نوبت برای ${selectedDate.year}/${selectedDate.month}/${selectedDate.day} ساعت ${selectedTime} ثبت شد`);
      setTimeout(() => setBookingStatus(null), 3000);
    } else {
      setBookingStatus('لطفاً تاریخ و ساعت را انتخاب کنید');
      setTimeout(() => setBookingStatus(null), 3000);
    }
  };

  if (loading) return <div className="text-center text-xl font-bold text-gray-600 py-10">در حال بارگذاری...</div>;
  if (!service) return <div className="text-center text-xl font-bold text-blue-500 py-10">سرویس یافت نشد</div>;

  const discountAmount = service.price - service.discount_price;
  const discountPercentage = service.discount_price > 0 ? ((1 - service.discount_price / service.price) * 100).toFixed(0) : '0';

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <img
              src={service.thumbnail}
              alt={service.title}
              className="w-full h-64 object-cover rounded-xl shadow-md"
            />
          </div>
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{service.title}</h1>
            <p className="text-gray-600 mb-6">{service.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <HiOutlineLocationMarker className="text-2xl text-blue-500" />
                <p className="text-gray-700">
                  <span className="font-semibold">کلینیک:</span> {service.clinic.name}, {service.clinic.address}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineLocationMarker className="text-2xl text-blue-500" />
                <p className="text-gray-700">
                  <span className="font-semibold">استان:</span> {province ? province.faname : 'نامشخص'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineClock className="text-2xl text-blue-500" />
                <p className="text-gray-700">
                  <span className="font-semibold">مدت زمان:</span> {service.time} دقیقه
                </p>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineCurrencyDollar className="text-2xl text-blue-500" />
                <div>
                  {service.discount_price > 0 && discountAmount > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm line-through">{service.price.toLocaleString()} تومان</span>
                      <span className="text-xl font-bold text-blue-500">{service.discount_price.toLocaleString()} تومان</span>
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">{discountPercentage}% تخفیف</span>
                    </div>
                  ) : (
                    <span className="text-xl font-bold text-gray-800">{service.price.toLocaleString()} تومان</span>
                  )}
                </div>
              </div>
            </div>
            {doctor && (
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={doctor.imageUrl}
                  alt={doctor.name}
                  className="w-16 h-16 object-cover rounded-full shadow-sm"
                />
                <div>
                  <p className="text-gray-700 font-semibold">پزشک: {doctor.name}</p>
                  <p className="text-gray-500 text-sm">تماس: {service.clinic.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">رزرو نوبت</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <DatePicker
              value={selectedDate}
              onChange={handleDateSelect}
              inputClassName="w-full p-3 rounded-lg border border-gray-300"
              wrapperClassName="custom-calendar"
              locale="fa"
              color="#ef4444"
            />
          </div>
          <div className="md:w-1/2">
            {selectedDate ? (
              <>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  نوبت‌های موجود در {selectedDate.day}/{selectedDate.month}/{selectedDate.year}
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`p-3 rounded-lg text-center ${
                        selectedTime === time
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                <Button
                  variant="solid"
                  size="lg"
                  className="w-full bg-blue-500 text-white hover:bg-blue-600"
                  onClick={handleBooking}
                >
                  ثبت نوبت
                </Button>
                {bookingStatus && (
                  <p className={`mt-4 text-center ${bookingStatus.includes('ثبت شد') ? 'text-green-500' : 'text-blue-500'}`}>
                    {bookingStatus}
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-600">لطفاً یک تاریخ انتخاب کنید</p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-calendar {
          border: 1px solid #e5e7eb;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 1rem;
          background: #ffffff;
        }
        .custom-calendar .rdp-day_selected {
          background-color: #ef4444 !important;
          color: #ffffff !important;
          border-radius: 0.5rem;
        }
        .custom-calendar .rdp-caption_label {
          color: #1f2937;
          font-weight: 600;
        }
        .custom-calendar .rdp-day {
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }
        .custom-calendar .rdp-day_today {
          border: 2px solid #ef4444;
        }
        .custom-calendar .rdp-head_row {
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default ServiceDetail;