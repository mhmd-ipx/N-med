import { HiOutlineStar } from 'react-icons/hi2';
import type { Doctor } from '../../services/publicApi';
import Button from '../ui/Button';

interface DoctorProfileProps {
  doctor: Doctor;
}

const DoctorProfile = ({ doctor }: DoctorProfileProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-32"></div>
      <div className="px-8 pb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 -mt-16">
          {/* Avatar */}
          <div className="relative">
            {doctor.avatar ? (
              <img
                src={doctor.avatar}
                alt={doctor.user?.name || 'دکتر'}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{doctor.user?.name || 'نام دکتر'}</h1>
            <p className="text-lg text-blue-600 font-medium mb-4">
              {Array.isArray(doctor.specialties) ? doctor.specialties.join(', ') : (doctor.specialties || 'بدون تخصص')}
            </p>

            {doctor.bio && (
              <p className="text-gray-600 leading-relaxed mb-6">{doctor.bio}</p>
            )}

            {/* Stats */}
            <div className="flex justify-center sm:justify-start gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.8</div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <HiOutlineStar className="w-4 h-4 text-yellow-400 fill-current" />
                  امتیاز
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">مراجعه کننده</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">5</div>
                <div className="text-sm text-gray-600">سال تجربه</div>
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