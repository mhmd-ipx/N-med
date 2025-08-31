import { getDoctors, getSpecialties } from '../../services/publicApi';
import type { Doctor, Specialty } from '../../services/publicApi';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import doctorPlaceholder from '../../assets/images/Doctors/doctor1.jpg';

const BestDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsResponse, specialtiesResponse] = await Promise.all([
          getDoctors(),
          getSpecialties()
        ]);
        // Filter only approved doctors
        const approvedDoctors = doctorsResponse.data.filter(doctor => doctor.status === 'approved');
        setDoctors(approvedDoctors);
        setSpecialties(specialtiesResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const getSpecialtyNames = (specialtyIds: number[] | string | null): string => {
    if (!specialtyIds || (Array.isArray(specialtyIds) && specialtyIds.length === 0)) return 'تخصص ذکر نشده';
    if (typeof specialtyIds === 'string') return specialtyIds;
    const names = specialtyIds.map(id => {
      const specialty = specialties.find(s => s.id === id);
      return specialty ? specialty.title : `تخصص ${id}`;
    }).filter(name => name);
    return names.length > 0 ? names.join(', ') : 'تخصص ذکر نشده';
  };

  return (
    <div className="max-w-[1300px] mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 className="font-bold text-2xl text-center text-gray-800 mb-4 sm:mb-0">برترین پزشکان</h2>
        <Link
          to="/doctors"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          مشاهده تمام پزشکان
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center border border-gray-100 hover:border-blue-200"
          >
            <div className="relative mb-4">
              <img
                src={doctor.avatar || doctorPlaceholder}
                alt={doctor.user.name}
                className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-blue-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = doctorPlaceholder;
                }}
              />
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                تایید شده
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{doctor.user.name}</h3>
            {doctor.specialties && (
              <p className="text-sm text-blue-600 font-medium mb-3">
                {getSpecialtyNames(doctor.specialties)}
              </p>
            )}

            <Link
              to={`/doctors/${doctor.id}`}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              مشاهده پروفایل
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestDoctors;