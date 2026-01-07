import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import Filters from '../components/ServiceCategories/Filters';
import { getDoctors, getProvinces, getSpecialties, getSymptoms, type Doctor, type DoctorsResponse, type Province, type Specialty, type Symptom } from '../services/publicApi';
import { Link, useSearchParams } from 'react-router-dom';
import { HiOutlineFilter, HiOutlineSearch } from 'react-icons/hi';
import doctorPlaceholder from '../assets/images/Doctors/doctor1.jpg';

const Doctors: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [allProvinces, setAllProvinces] = useState<Province[]>([]);
  const [allSpecialties, setAllSpecialties] = useState<Specialty[]>([]);
  const [allSymptoms, setAllSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);

  // Read filters from URL
  const searchTerm = searchParams.get('search') || '';
  const provinceSlug = searchParams.get('province');
  const specialtySlug = searchParams.get('specialty');
  const symptomSlug = searchParams.get('symptom');

  // Find selected province and specialty objects
  const selectedProvince = provinceSlug
    ? allProvinces.find(p => p.enname.toLowerCase() === provinceSlug.toLowerCase())
    : null;

  const selectedSpecialty = specialtySlug
    ? allSpecialties.find(s => s.slug.toLowerCase() === specialtySlug.toLowerCase())
    : null;

  const selectedSymptom = symptomSlug
    ? allSymptoms.find(s => s.slug.toLowerCase() === symptomSlug.toLowerCase())
    : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [doctorsResponse, provincesData, specialtiesData, symptomsData] = await Promise.all([
          getDoctors(),
          getProvinces(),
          getSpecialties(),
          getSymptoms(),
        ]);
        if (doctorsResponse && doctorsResponse.data) {
          // Filter only approved doctors
          const approvedDoctors = doctorsResponse.data.filter(doctor => doctor.status === 'approved');
          setDoctors(approvedDoctors);
        }
        if (Array.isArray(provincesData)) setAllProvinces(provincesData);
        if (Array.isArray(specialtiesData)) setAllSpecialties(specialtiesData);
        if (symptomsData && Array.isArray(symptomsData.data)) {
          setAllSymptoms(symptomsData.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter provinces and specialties based on actual doctors data
  const availableProvinces = useMemo(() => {
    const provinceNames = new Set<string>();

    doctors.forEach(doctor => {
      // Extract province from clinics addresses
      doctor.clinics.forEach(clinic => {
        if (clinic.address) {
          // Try to match province name in address
          allProvinces.forEach(province => {
            if (clinic.address.includes(province.faname) || clinic.address.includes(province.enname)) {
              provinceNames.add(province.enname);
            }
          });
        }
      });

      // Also check doctor's own address
      if (doctor.address) {
        allProvinces.forEach(province => {
          if (doctor.address!.includes(province.faname) || doctor.address!.includes(province.enname)) {
            provinceNames.add(province.enname);
          }
        });
      }
    });

    return allProvinces.filter(province => provinceNames.has(province.enname));
  }, [doctors, allProvinces]);

  const availableSpecialties = useMemo(() => {
    const specialtyIds = new Set<number>();

    doctors.forEach(doctor => {
      if (doctor.specialties && Array.isArray(doctor.specialties)) {
        doctor.specialties.forEach(id => specialtyIds.add(id));
      }
    });

    return allSpecialties.filter(specialty => specialtyIds.has(specialty.id));
  }, [doctors, allSpecialties]);

  const availableSymptoms = useMemo(() => {
    const symptomIds = new Set<number>();

    doctors.forEach(doctor => {
      if (doctor.symptoms && Array.isArray(doctor.symptoms)) {
        doctor.symptoms.forEach(symptom => {
          symptomIds.add(symptom.id);
        });
      }
    });

    const available = allSymptoms.filter(symptom => symptomIds.has(symptom.id));
    return available;
  }, [doctors, allSymptoms]);

  const getSpecialtyNames = (specialtyIds: number[] | string | null): string => {
    if (!specialtyIds || (Array.isArray(specialtyIds) && specialtyIds.length === 0)) return 'تخصص ذکر نشده';
    if (typeof specialtyIds === 'string') return specialtyIds;
    const names = specialtyIds.map(id => {
      const specialty = allSpecialties.find(s => s.id === id);
      return specialty ? specialty.title : `تخصص ${id}`;
    }).filter(name => name);
    return names.length > 0 ? names.join(', ') : 'تخصص ذکر نشده';
  };

  const filteredDoctors = useMemo(() => {
    setFiltering(true);

    const filtered = doctors.filter((doctor) => {
      const matchesSearch = doctor.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doctor.bio && doctor.bio.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesProvince = !selectedProvince || (doctor.address && doctor.address.includes('اصفهان')); // Simple province check
      const matchesSpecialty = !selectedSpecialty ||
        (Array.isArray(doctor.specialties) && doctor.specialties.includes(selectedSpecialty.id));

      // Check if doctor has the selected symptom
      const matchesSymptom = !selectedSymptom ||
        (doctor.symptoms && Array.isArray(doctor.symptoms) && doctor.symptoms.length > 0 &&
          doctor.symptoms.some(symptom => symptom.id === selectedSymptom.id));

      return matchesSearch && matchesProvince && matchesSpecialty && matchesSymptom;
    });

    // Simulate filtering delay for better UX
    setTimeout(() => setFiltering(false), 300);
    return filtered;
  }, [doctors, searchTerm, selectedProvince, selectedSpecialty, selectedSymptom]);

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

  const handleSpecialtyChange = (specialtyId: number | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (specialtyId) {
      const specialty = allSpecialties.find(s => s.id === specialtyId);
      if (specialty) {
        newParams.set('specialty', specialty.slug.toLowerCase());
      }
    } else {
      newParams.delete('specialty');
    }
    setSearchParams(newParams);
    setFiltering(true);
  };

  const handleSymptomChange = (symptom: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (symptom) {
      newParams.set('symptom', symptom);
    } else {
      newParams.delete('symptom');
    }
    setSearchParams(newParams);
    setFiltering(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Helmet>
        <title>آرشیو پزشکان | نیلو درمان</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8 max-w-[1300px]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            آرشیو پزشکان
          </h1>
          <p className="text-gray-600 text-lg">پیدا کردن بهترین پزشک برای شما</p>
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
                    placeholder="جستجوی پزشکان..."
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
                specialties={availableSpecialties}
                symptoms={availableSymptoms}
                selectedProvince={selectedProvince?.id || null}
                selectedSpecialty={selectedSpecialty?.id || null}
                selectedSymptom={selectedSymptom?.slug || null}
                onProvinceChange={handleProvinceChange}
                onSpecialtyChange={handleSpecialtyChange}
                onSymptomChange={handleSymptomChange}
              />
            </div>
          </div>

          {/* Doctors Section - Right Side */}
          <div className="flex-1">
            {/* Doctors Grid with Results Count */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Results Count inside doctors section */}
              <div className="mb-6 pb-4 border-b border-gray-200">
                {filtering ? (
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    <span className="font-medium">در حال جستجو...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">{filteredDoctors.length} پزشک یافت شد</span>
                    {(selectedProvince || selectedSpecialty || selectedSymptom || searchTerm) && (
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
                  <p className="text-gray-600 mt-4 text-lg">در حال بارگذاری پزشکان...</p>
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">هیچ پزشکی یافت نشد</h3>
                  <p className="text-gray-500">لطفاً فیلترها را تغییر دهید یا عبارت جستجو را اصلاح کنید</p>
                </div>
              ) : (
                <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
                  {filteredDoctors.map((doctor) => (
                    <div key={doctor.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 border border-gray-100 hover:border-blue-200 flex items-center gap-4">
                      <img
                        src={doctor.avatar || doctorPlaceholder}
                        alt={doctor.user.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = doctorPlaceholder;
                        }}
                      />
                      <div className="flex-1 text-right">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{doctor.user.name}</h3>
                        <p className="text-sm text-blue-600 font-medium mb-2">
                          {getSpecialtyNames(doctor.specialties)}
                        </p>
                        <Link
                          to={`/doctors/${doctor.id}`}
                          className="inline-block w-full bg-primary rounded-full hover:bg-blue-700 text-white font-medium py-2 px-4 text-sm text-center transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                          مشاهده پروفایل
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;