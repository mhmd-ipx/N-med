import { HiOutlineStar } from 'react-icons/hi2';
import type { Doctor } from '../../services/publicApi';
import Button from '../ui/Button';

interface DoctorProfileProps {
  doctor: Doctor;
  stats?: { averageRating: number; reviewCount: number } | null;
}

const DoctorProfile = ({ doctor, stats }: DoctorProfileProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-32"></div>
      <div className="px-8 pb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 -mt-20">
          {/* Avatar */}
          <div className="relative">
            {doctor.avatar ? (
              <img
                src={doctor.avatar}
                alt={doctor.user?.name || 'دکتر'}
                className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                {doctor.user?.name?.charAt(0) || 'د'}
              </div>
            )}
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
          </div>

          {/* Doctor Info */}
          <div className="flex-1 text-center sm:text-right">
            <h1 className="text-3xl font-bold mb-1 hidden md:block text-white">دکتر {doctor.user?.name || 'نام دکتر'}</h1>
            <h1 className="text-3xl font-bold text-gray-900 mb-1 md:hidden">دکتر {doctor.user?.name || 'نام دکتر'}</h1>
            <p className="text-lg font-medium mb-8 hidden md:block text-white">متخصص {Array.isArray(doctor.specialties) ? doctor.specialties.join(', ') : (doctor.specialties || 'بدون تخصص')}</p>
            <p className="text-lg font-medium text-blue-600 mb-8 md:hidden">متخصص {Array.isArray(doctor.specialties) ? doctor.specialties.join(', ') : (doctor.specialties || 'بدون تخصص')}</p>

            {doctor.bio && (
              <p className="text-gray-600 leading-relaxed mb-6">{doctor.bio}</p>
            )}

            {/* Stats */}
            <div className="flex justify-center sm:justify-start gap-6 mb-6">
               <div className="text-center">
                 <div className="text-2xl font-bold text-gray-900">
                   {stats ? stats.averageRating.toFixed(1) : '0.0'}
                 </div>
                 <div className="flex items-center gap-1 text-sm text-gray-600">
                   <HiOutlineStar className="w-4 h-4 text-yellow-400 fill-current" />
                   امتیاز ({stats ? stats.reviewCount : 0} نظر)
                 </div>
               </div>
             </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
              <Button variant="solid" size="lg" className="px-8">
                رزرو نوبت
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                تماس تلفنی
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;