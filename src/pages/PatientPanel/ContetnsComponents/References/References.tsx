import React, { useState } from "react";
import { FaUserMd, FaHeart, FaStar, FaPhone, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

// تعریف نوع برای ارجاعات دریافتی بیمار
interface PatientReferral {
  id: number;
  referringDoctorName: string;
  referringDoctorSpecialty: string;
  referringDoctorClinic: string;
  reason: string;
  date: string;
  status: 'active' | 'used' | 'expired';
  notes?: string;
}

// تعریف نوع برای پزشکان مورد علاقه
interface FavoriteDoctor {
  id: number;
  name: string;
  specialty: string;
  clinicName: string;
  clinicAddress: string;
  phone: string;
  rating: number;
  reviewCount: number;
  isFavorite: boolean;
}

// داده‌های تستی برای ارجاعات دریافتی
const mockReferrals: PatientReferral[] = [
  {
    id: 1,
    referringDoctorName: 'دکتر علی رضایی',
    referringDoctorSpecialty: 'قلب و عروق',
    referringDoctorClinic: 'کلینیک قلب تهران',
    reason: 'نیاز به مشاوره متخصص قلب',
    date: '۱۴۰۳/۰۶/۱۰',
    status: 'active',
    notes: 'لطفاً نتیجه آزمایشات قبلی را همراه داشته باشید'
  },
  {
    id: 2,
    referringDoctorName: 'دکتر مریم احمدی',
    referringDoctorSpecialty: 'داخلی',
    referringDoctorClinic: 'بیمارستان روزبه',
    reason: 'پیگیری بیماری زمینه‌ای',
    date: '۱۴۰۳/۰۵/۲۰',
    status: 'used',
    notes: 'پیگیری در نوبت بعدی'
  },
  {
    id: 3,
    referringDoctorName: 'دکتر رضا کرمی',
    referringDoctorSpecialty: 'ارتوپدی',
    referringDoctorClinic: 'کلینیک ارتوپدی اصفهان',
    reason: 'معاینه مفصل زانو',
    date: '۱۴۰۳/۰۴/۱۵',
    status: 'expired',
    notes: 'ارجاع منقضی شده'
  }
];

// داده‌های تستی برای پزشکان مورد علاقه
const mockFavoriteDoctors: FavoriteDoctor[] = [
  {
    id: 1,
    name: 'دکتر علی رضایی',
    specialty: 'قلب و عروق',
    clinicName: 'کلینیک قلب تهران',
    clinicAddress: 'تهران، خیابان ولیعصر، پلاک ۱۵۶',
    phone: '021-12345678',
    rating: 4.8,
    reviewCount: 127,
    isFavorite: true
  },
  {
    id: 2,
    name: 'دکتر مریم احمدی',
    specialty: 'داخلی',
    clinicName: 'بیمارستان روزبه',
    clinicAddress: 'تهران، خیابان شهید بهشتی',
    phone: '021-87654321',
    rating: 4.9,
    reviewCount: 89,
    isFavorite: true
  },
  {
    id: 3,
    name: 'دکتر رضا کرمی',
    specialty: 'ارتوپدی',
    clinicName: 'کلینیک ارتوپدی اصفهان',
    clinicAddress: 'اصفهان، خیابان چهارباغ',
    phone: '031-12345678',
    rating: 4.7,
    reviewCount: 156,
    isFavorite: true
  },
  {
    id: 4,
    name: 'دکتر سارا حسینی',
    specialty: 'زنان و زایمان',
    clinicName: 'کلینیک زنان تهران',
    clinicAddress: 'تهران، خیابان انقلاب',
    phone: '021-11223344',
    rating: 4.6,
    reviewCount: 94,
    isFavorite: true
  }
];

const References: React.FC = () => {
  const [referrals, setReferrals] = useState<PatientReferral[]>(mockReferrals);
  const [favoriteDoctors, setFavoriteDoctors] = useState<FavoriteDoctor[]>(mockFavoriteDoctors);
  const [activeTab, setActiveTab] = useState<'referrals' | 'favorites'>('referrals');

  // هندلر حذف از پزشکان مورد علاقه
  const handleRemoveFavorite = (doctorId: number) => {
    setFavoriteDoctors(prev =>
      prev.map(doctor =>
        doctor.id === doctorId
          ? { ...doctor, isFavorite: false }
          : doctor
      ).filter(doctor => doctor.isFavorite)
    );
  };

  // آیکون و رنگ وضعیت ارجاع
  const getReferralStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { icon: <FaCalendarAlt />, color: 'text-green-600', text: 'فعال' };
      case 'used':
        return { icon: <FaCalendarAlt />, color: 'text-blue-600', text: 'استفاده شده' };
      case 'expired':
        return { icon: <FaCalendarAlt />, color: 'text-red-600', text: 'منقضی شده' };
      default:
        return { icon: <FaCalendarAlt />, color: 'text-gray-600', text: 'نامشخص' };
    }
  };

  // رندر ستاره‌های امتیاز
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`text-sm ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="px-4 min-h-screen" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* هدر */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">ارجاعات و پزشکان مورد علاقه</h2>
        </div>

        {/* تب‌ها */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('referrals')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'referrals'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              ارجاعات دریافتی
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'favorites'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              پزشکان مورد علاقه
            </button>
          </div>
        </div>

        {/* محتوای تب‌ها */}
        {activeTab === 'referrals' && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">ارجاعات دریافتی از پزشکان</h3>
            {referrals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                هیچ ارجاعی دریافت نکرده‌اید
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {referrals.map((referral) => {
                  const statusInfo = getReferralStatusInfo(referral.status);

                  return (
                    <div key={referral.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-800">{referral.referringDoctorName}</h4>
                          <p className="text-sm text-gray-600">{referral.referringDoctorSpecialty}</p>
                        </div>
                        <div className={`flex items-center gap-1 ${statusInfo.color}`}>
                          {statusInfo.icon}
                          <span className="text-sm">{statusInfo.text}</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-500" />
                          <span>{referral.referringDoctorClinic}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-500" />
                          <span>تاریخ ارجاع: {referral.date}</span>
                        </div>
                        <div>
                          <p className="text-gray-500">دلیل ارجاع:</p>
                          <p className="font-medium">{referral.reason}</p>
                        </div>
                        {referral.notes && (
                          <div>
                            <p className="text-gray-500">یادداشت:</p>
                            <p className="text-sm bg-gray-50 p-2 rounded">{referral.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">پزشکان مورد علاقه شما</h3>
            {favoriteDoctors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                هیچ پزشکی به عنوان مورد علاقه انتخاب نکرده‌اید
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {favoriteDoctors.map((doctor) => (
                  <div key={doctor.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                          <FaUserMd className="text-primary" />
                          {doctor.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>

                        {/* امتیاز و تعداد نظرات */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            {renderStars(doctor.rating)}
                            <span className="text-sm text-gray-600">({doctor.rating})</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {doctor.reviewCount} نظر
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveFavorite(doctor.id)}
                        className="text-red-500 hover:text-red-700 p-2"
                        title="حذف از مورد علاقه"
                      >
                        <FaHeart className="text-lg" />
                      </button>
                    </div>

                    {/* اطلاعات کلینیک */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-500" />
                        <div>
                          <p className="font-medium">{doctor.clinicName}</p>
                          <p className="text-gray-600">{doctor.clinicAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-gray-500" />
                        <span>{doctor.phone}</span>
                      </div>
                    </div>

                    {/* دکمه‌های اقدام */}
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                        رزرو نوبت
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        مشاهده پروفایل
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default References;