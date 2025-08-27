import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { getServices, getDoctors, getprovinces } from '../services/api';
import type { Services, Doctor, provinces } from '../types/types';
import SingleServiceCard from '../components/ui/ServiceCard/SingleServiceCard';
import SearchInput from '../components/ui/SearchInput/SearchInput';

function Appointments() {
  const [services, setServices] = useState<Services[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [provinces, setProvinces] = useState<provinces[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesData, doctorsData, provincesData] = await Promise.all([
          getServices(),
          getDoctors(),
          getprovinces(),
        ]);

        if (Array.isArray(servicesData)) setServices(servicesData);
        if (Array.isArray(doctorsData)) setDoctors(doctorsData);
        if (Array.isArray(provincesData)) setProvinces(provincesData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSpecialtyChange = (e) => {
    setSelectedSpecialty(e.target.value);
  };

  const filteredServices = services.filter((service) => {
    const doctor = doctors.find((doc) => String(doc.id) === String(service.doctorId));
    return (
      (!selectedSpecialty || (doctor && doctor.specialtyIds.includes(selectedSpecialty))) &&
      (!selectedDate || (doctor && doctor.availableTimes.some(time => time.includes(selectedDate))))
    );
  });

  return (
    <div className='w-full justify-center items-center flex'>
      <Helmet>
        <title>نوبت‌دهی</title>
      </Helmet>
      <div className='w-full'>
        {/* Appointments Hero Section */}
        <section className='bg-gray-100 py-12 md:py-16'>
          <div className='container mx-auto px-4 text-center'>
            <h1 className='text-2xl md:text-4xl font-bold mb-4'>نوبت‌دهی آنلاین</h1>
            <p className='text-base md:text-lg text-gray-600 max-w-2xl mx-auto'>
              به راحتی پزشک مورد نظر خود را پیدا کنید و نوبت خود را رزرو کنید.
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className='max-w-[1300px] mx-auto -mt-16 md:-mt-20 mb-20 md:mb-36 px-4'>
          <div className='bg-light rounded-2xl md:rounded-3xl items-center flex flex-col pb-4 shadow-lg'>
            <SearchInput />
          </div>
        </section>

        {/* Filters Section */}
        <section className='py-12 md:py-16'>
          <div className='container mx-auto px-4'>
            <h2 className='text-xl md:text-2xl font-semibold mb-6'>فیلتر نوبت‌ها</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8'>
              <div>
                <label htmlFor='date' className='block text-sm font-medium text-gray-700'>تاریخ</label>
                <input
                  type='date'
                  id='date'
                  className='mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </div>
              <div>
                <label htmlFor='specialty' className='block text-sm font-medium text-gray-700'>تخصص</label>
                <select
                  id='specialty'
                  className='mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={selectedSpecialty}
                  onChange={handleSpecialtyChange}
                >
                  <option value=''>همه تخصص‌ها</option>
                  <option value='cardiology'>قلب و عروق</option>
                  <option value='neurology'>مغز و اعصاب</option>
                  <option value='general'>عمومی</option>
                  <option value='pediatricsdif'>کودکان</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className='py-12 md:py-16 bg-gray-100'>
          <div className='container mx-auto px-4'>
            <h2 className='text-xl md:text-2xl font-semibold mb-6'>خدمات موجود</h2>
            {loading ? (
              <div className="text-center py-8">در حال بارگذاری...</div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-8 text-gray-600">داده‌ای برای نمایش وجود ندارد</div>
            ) : (
              <div className='gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
                {filteredServices.slice(0, 6).map((service) => {
                  const doctor = doctors.find((doc) => String(doc.id) === String(service.doctorId)) || {
                    id: 0,
                    name: 'نامشخص',
                    imageUrl: '/default.jpg',
                    specialtyIds: [],
                    cityId: 0,
                    availableTimes: [],
                  };
                  const doctorCityId = 'cityId' in doctor ? doctor.cityId : undefined;
                  const province = provinces.find((prov) => String(prov.id) === String(doctorCityId)) || {
                    id: 0,
                    name: 'نامشخص',
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
            )}
          </div>
        </section>

        {/* Booking Calendar Section */}
        <section className='py-12 md:py-16'>
          <div className='container mx-auto px-4'>
            <h2 className='text-xl md:text-2xl font-semibold mb-6 text-center'>تقویم نوبت‌دهی</h2>
            <div className='bg-white shadow-md rounded-lg p-4 md:p-6'>
              <p className='text-gray-600 text-center text-sm md:text-base'>
                تقویم تعاملی برای انتخاب تاریخ و زمان (به زودی اضافه خواهد شد)
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Appointments;