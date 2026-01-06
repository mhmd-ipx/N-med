import React, { useState, useEffect, useMemo } from 'react';
import Filters from '../components/ServiceCategories/Filters';
import { getDoctors, type Doctor } from '../services/referralApi';
import { getServices, SingleServiceCard } from '../pages/HomeComponents/ServiceCard';
import { getProvinces, getSpecialties, type Province, type Specialty } from '../services/publicApi';
import type { Service } from '../pages/HomeComponents/ServiceCard';
import { HiOutlineFilter, HiOutlineSearch } from 'react-icons/hi';
import { useSearchParams } from 'react-router-dom';

const ServiceCategories: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [allProvinces, setAllProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);

  // Read filters from URL
  const searchTerm = searchParams.get('search') || '';
  const provinceSlug = searchParams.get('province');


  // Find selected province and specialty objects
  const selectedProvince = provinceSlug
    ? allProvinces.find(p => p.enname.toLowerCase() === provinceSlug.toLowerCase())
    : null;



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesData, doctorsResponse, provincesData] = await Promise.all([
          getServices(),
          getDoctors(),
          getProvinces(),
        ]);
        console.log('servicesData', servicesData);
        // console.log('Services:', servicesData);
        // console.log('Doctors:', doctorsResponse);
        // console.log('Provinces:', provincesData);

        if (Array.isArray(servicesData)) setServices(servicesData);
        if (doctorsResponse && doctorsResponse.data) setDoctors(doctorsResponse.data);
        if (Array.isArray(provincesData)) setAllProvinces(provincesData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter provinces and specialties based on actual services data
  const availableProvinces = useMemo(() => {
    const provinceIds = new Set(services.map(service => service.clinic?.province_id).filter(Boolean));
    return allProvinces.filter(province => provinceIds.has(province.id));
  }, [services, allProvinces]);



  const filteredServices = useMemo(() => {
    setFiltering(true);
    const filtered = services.filter((service) => {
      const doctor = service.doctor || doctors.find((doc) => doc.clinics.some((clinic: any) => clinic.id === service.clinic.id));
      const province = allProvinces.find((prov) => prov.id === service.clinic?.province_id);

      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProvince = !selectedProvince || (province && province.id === selectedProvince.id);

      return matchesSearch && matchesProvince && doctor && province;
    });

    // Simulate filtering delay for better UX
    setTimeout(() => setFiltering(false), 300);
    return filtered;
  }, [services, doctors, allProvinces, searchTerm, selectedProvince]);

  const handleSearchChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
    setFiltering(true);
  };

  const handleProvinceChange = (provinceId: number | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (provinceId) {
      const province = allProvinces.find(p => p.id === provinceId);
      if (province) {
        newParams.set('province', province.enname.toLowerCase());
      }
    } else {
      newParams.delete('province');
    }
    setSearchParams(newParams);
    setFiltering(true);
  };

  const handleSpecialtyChange = (_specialtyId: number | null) => {
    // Not used in this page - only kept for Filters component compatibility
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-[1300px]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            دسته‌بندی خدمات
          </h1>
          <p className="text-gray-600 text-lg">آرشیو کامل خدمات پزشکی</p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Left Side */}
          <div className="lg:w-96">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              {/* Search in Sidebar */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <HiOutlineSearch className="text-blue-500 w-6 h-6" />
                  <h3 className="text-xl font-bold text-gray-800">جستجو</h3>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="جستجوی خدمات..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pr-4 pl-4 py-4 text-right border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 mb-6">
                <HiOutlineFilter className="text-blue-500 w-6 h-6" />
                <h3 className="text-xl font-bold text-gray-800">فیلترها</h3>
              </div>

              <Filters
                provinces={availableProvinces}
                specialties={[]}
                selectedProvince={selectedProvince?.id || null}
                selectedSpecialty={null}
                onProvinceChange={handleProvinceChange}
                onSpecialtyChange={handleSpecialtyChange}
              />
            </div>
          </div>

          {/* Services Section - Right Side */}
          <div className="flex-1">
            {/* Services Grid with Results Count */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Results Count inside services section */}
              <div className="mb-6 pb-4 border-b border-gray-200">
                {filtering ? (
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    <span className="font-medium">در حال جستجو...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">{filteredServices.length} خدمت یافت شد</span>
                    {(selectedProvince || searchTerm) && (
                      <button
                        onClick={() => {
                          setSearchParams(new URLSearchParams());
                        }}
                        className="text-sm text-red-500 hover:text-red-600 font-medium"
                      >
                        پاک کردن فیلترها
                      </button>
                    )}
                  </div>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0"></div>
                  </div>
                  <p className="text-gray-600 mt-4 text-lg">در حال بارگذاری خدمات...</p>
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">هیچ خدماتی یافت نشد</h3>
                  <p className="text-gray-500">لطفاً فیلترها را تغییر دهید یا عبارت جستجو را اصلاح کنید</p>
                </div>
              ) : (
                <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2">
                  {filteredServices.map((service) => {
                    const province = allProvinces.find((prov) => prov.id === service.clinic?.province_id);

                    return (
                      <div key={service.id} className="transform hover:scale-105 transition-transform duration-200">
                        <SingleServiceCard
                          service={service}
                          province={province}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCategories;