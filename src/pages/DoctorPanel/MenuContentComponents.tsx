import { useState, useEffect, type SetStateAction } from 'react';

import { HiOutlineUser, HiOutlinePhone, HiOutlineDocumentText, HiOutlineUserCircle, HiOutlineChevronDown } from 'react-icons/hi';
import Button from '../../components/ui/Button';
import type { Doctor } from '../../services/referralApi';

interface Referral {
  id: number;
  patientName: string;
  patientPhone: string;
  notes: string;
  referblueDoctor: string;
  createdAt: string;
}

const doctors: Doctor[] = [
  {
    id: 1,
    user: {
      id: 1,
      name: 'دکتر علی مردانی',
      phone: '09123456789',
      role: 'doctor'
    },
    specialties: 'قلب و عروق',
    address: 'تهران، خیابان ولیعصر',
    bio: 'متخصص قلب و عروق با بیش از 15 سال تجربه',
    avatar: '/src/assets/images/Doctors/doctor1.jpg',
    code: 'DR001',
    status: 'active',
    clinics: [],
    created_at: '2024-01-01T00:00:00.000000Z',
    updated_at: '2024-01-01T00:00:00.000000Z'
  },
  {
    id: 2,
    user: {
      id: 2,
      name: 'دکتر رضا احمدی',
      phone: '09123456790',
      role: 'doctor'
    },
    specialties: 'داخلی',
    address: 'تهران، خیابان انقلاب',
    bio: 'متخصص داخلی با تجربه در درمان بیماری‌های داخلی',
    avatar: '/src/assets/images/Doctors/doctor2.jpg',
    code: 'DR002',
    status: 'active',
    clinics: [],
    created_at: '2024-01-01T00:00:00.000000Z',
    updated_at: '2024-01-01T00:00:00.000000Z'
  },
  {
    id: 3,
    user: {
      id: 3,
      name: 'دکتر مریم حسینی',
      phone: '09123456791',
      role: 'doctor'
    },
    specialties: 'زنان و زایمان',
    address: 'تهران، خیابان شریعتی',
    bio: 'متخصص زنان و زایمان با تمرکز بر سلامت مادر و کودک',
    avatar: '/src/assets/images/Doctors/doctor1.jpg',
    code: 'DR003',
    status: 'active',
    clinics: [],
    created_at: '2024-01-01T00:00:00.000000Z',
    updated_at: '2024-01-01T00:00:00.000000Z'
  },
];

const Settings = () => {
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [referblueDoctor, setReferblueDoctor] = useState('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const stoblueReferrals = localStorage.getItem('referrals');
    if (stoblueReferrals) {
      setReferrals(JSON.parse(stoblueReferrals));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone || !referblueDoctor) {
      setStatus('لطفاً تمام فیلدها را پر کنید');
      setTimeout(() => setStatus(null), 3000);
      return;
    }

    const newReferral: Referral = {
      id: Date.now(),
      patientName,
      patientPhone,
      notes,
      referblueDoctor,
      createdAt: new Date().toLocaleString('fa-IR'),
    };

    const updatedReferrals = [...referrals, newReferral];
    setReferrals(updatedReferrals);
    localStorage.setItem('referrals', JSON.stringify(updatedReferrals));
    setPatientName('');
    setPatientPhone('');
    setNotes('');
    setReferblueDoctor('');
    setStatus('ارجاع با موفقیت ثبت شد');
    setTimeout(() => setStatus(null), 3000);
  };

  const handleClearHistory = () => {
    setReferrals([]);
    localStorage.removeItem('referrals');
    setStatus('تاریخچه پاک شد');
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 backdrop-blur-sm bg-white/95">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">ارجاع بیمار</h1>
              <p className="text-gray-600">انتخاب پزشک مناسب برای ارجاع بیمار</p>
            </div>
        <div className="flex border-b border-gray-300 mb-6">
          <button
            className={`px-4 py-2 text-lg font-semibold ${
              activeTab === 'form' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('form')}
          >
            فرم ارجاع
          </button>
          <button
            className={`px-4 py-2 text-lg font-semibold ${
              activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('history')}
          >
            تاریخچه ارجاعات
          </button>
        </div>

        {activeTab === 'form' ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold mb-3 flex items-center gap-2">
                  <HiOutlineUser className="text-xl text-blue-500" />
                  نام بیمار
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="نام بیمار را وارد کنید"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <HiOutlineUser className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold mb-3 flex items-center gap-2">
                  <HiOutlinePhone className="text-xl text-blue-500" />
                  شماره همراه بیمار
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="0912XXXXXXX"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <HiOutlinePhone className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold mb-3 flex items-center gap-2">
                <HiOutlineDocumentText className="text-xl text-blue-500" />
                یادداشت
              </label>
              <div className="relative">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                  placeholder="یادداشت برای بیمار (اختیاری)"
                  rows={4}
                />
                <div className="absolute left-3 top-4 text-gray-400">
                  <HiOutlineDocumentText className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold mb-4 flex items-center gap-2">
                <HiOutlineUserCircle className="text-xl text-blue-500" />
                دکتر برای ارجاع
              </label>

              {/* Doctor Selection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    onClick={() => setReferblueDoctor(doctor.user.name)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      referblueDoctor === doctor.user.name
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={doctor.avatar || '/src/assets/images/userimg.png'}
                          alt={doctor.user.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                        />
                        {referblueDoctor === doctor.user.name && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-sm truncate">{doctor.user.name}</h4>
                        <p className="text-blue-600 font-medium text-xs">{doctor.specialties || 'تخصص نامشخص'}</p>
                        {doctor.bio && (
                          <p className="text-gray-500 text-xs mt-1 line-clamp-1">{doctor.bio}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Doctor Preview */}
              {referblueDoctor && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
                  {(() => {
                    const selectedDoctor = doctors.find(d => d.user.name === referblueDoctor);
                    return selectedDoctor ? (
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={selectedDoctor.avatar || '/src/assets/images/userimg.png'}
                            alt={selectedDoctor.user.name}
                            className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 text-lg">{selectedDoctor.user.name}</h4>
                          <p className="text-blue-600 font-medium text-sm">{selectedDoctor.specialties || 'تخصص نامشخص'}</p>
                          {selectedDoctor.bio && (
                            <p className="text-gray-600 text-xs mt-1 line-clamp-2">{selectedDoctor.bio}</p>
                          )}
                          {selectedDoctor.address && (
                            <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                              <HiOutlineUser className="w-3 h-3" />
                              {selectedDoctor.address}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center space-y-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-8 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center gap-2">
                  <HiOutlineUserCircle className="w-5 h-5" />
                  ثبت ارجاع
                </div>
              </button>
              {status && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  status.includes('موفقیت')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {status.includes('موفقیت') ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="font-medium">{status}</span>
                </div>
              )}
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">تاریخچه ارجاعات</h2>
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-100 transition-colors"
              >
                پاک کردن تاریخچه
              </button>
            </div>
            {referrals.length === 0 ? (
              <p className="text-gray-600 text-center">هیچ ارجاعی ثبت نشده است</p>
            ) : (
              <div className="grid gap-4">
                {referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <p className="text-gray-700">
                        <span className="font-semibold">نام بیمار:</span> {referral.patientName}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">شماره همراه:</span> {referral.patientPhone}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">دکتر ارجاع:</span> {referral.referblueDoctor}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">تاریخ:</span> {referral.createdAt}
                      </p>
                      {referral.notes && (
                        <p className="text-gray-700 sm:col-span-2">
                          <span className="font-semibold">یادداشت:</span> {referral.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
          </div>
        </div>
      </div>

      <style>{`
        .container {
          max-width: 800px;
        }
        input, textarea, select {
          transition: all 0.3s ease;
        }
        input:focus, textarea:focus, select:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        .custom-calendar {
          border: 1px solid #e5e7eb;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 1rem;
          background: #ffffff;
        }
      `}</style>
    </div>
  );
};

export default Settings;

type ProfileInfoProps = {
  user: {
    name?: string;
    email?: string;
  };
  token: string | null | undefined;
};

const ProfileInfo = ({ user, token }: ProfileInfoProps) => (
  <div className="p-4">
    <h2 className="text-xl font-semibold mb-4">اطلاعات پروفایل پزشک</h2>
    <p>نام: {user.name || 'پزشک'}</p>
    <p>ایمیل: {user.email || 'ایمیل'}</p>
    <p>توکن: {token ? 'فعال' : 'غیرفعال'}</p>
  </div>
);

const Appointments = () => (
  <div className="p-4">
    <h2 className="text-xl font-semibold mb-4">وقت‌های ملاقات</h2>
    <p>لیست وقت‌های ملاقات پزشک...</p>
  </div>
);



// دیتای نمونه برای نوبت‌ها
const mockAppointments = [
  {
    id: 1,
    patientName: 'علی رضایی',
    age: 34,
    gender: 'مرد',
    phone: '09123456789',
    appointmentDate: '1404/05/15',
    appointmentTime: '10:30',
    service: 'معاینه عمومی',
    notes: 'بیمار سابقه فشار خون بالا دارد.',
    status: 'تایید شده',
  },
  {
    id: 2,
    patientName: 'مریم احمدی',
    age: 28,
    gender: 'زن',
    phone: '09356789012',
    appointmentDate: '1404/05/16',
    appointmentTime: '14:00',
    service: 'مشاوره قلب',
    notes: 'نیاز به بررسی ECG.',
    status: 'در انتظار',
  },
  {
    id: 3,
    patientName: 'حسین محمدی',
    age: 45,
    gender: 'مرد',
    phone: '09212345678',
    appointmentDate: '1404/05/17',
    appointmentTime: '09:00',
    service: 'چکاپ کامل',
    notes: 'دیابت نوع 2، نیاز به آزمایش خون.',
    status: 'تایید شده',
  },
];

type Appointment = {
  id: number;
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  service: string;
  notes: string;
  status: string;
};

const MedicalRecords = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterService, setFilterService] = useState('همه');

  // تابع برای باز کردن مودال
  const openModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  // تابع برای بستن مودال
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  // فیلتر کردن نوبت‌ها
  const filteredAppointments = filterService === 'همه'
    ? mockAppointments
    : mockAppointments.filter((appointment) => appointment.service === filterService);

  // لیست سرویس‌های منحصربه‌فرد
  const services = ['همه', ...new Set(mockAppointments.map((app) => app.service))];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">نوبت ها</h2>

      {/* فیلتر سرویس */}
      <div className="mb-4 flex justify-end">
        <select
          className="p-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterService}
          onChange={(e) => setFilterService(e.target.value)}
        >
          {services.map((service, index) => (
            <option key={index} value={service}>{service}</option>
          ))}
        </select>
      </div>

      {/* جدول نوبت‌ها */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-right text-sm font-semibold text-gray-600">نام بیمار</th>
              <th className="p-3 text-right text-sm font-semibold text-gray-600">تاریخ نوبت</th>
              <th className="p-3 text-right text-sm font-semibold text-gray-600">نوع سرویس</th>
              <th className="p-3 text-right text-sm font-semibold text-gray-600">وضعیت</th>
              <th className="p-3 text-right text-sm font-semibold text-gray-600">جزئیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-right text-gray-700">{appointment.patientName}</td>
                <td className="p-3 text-right text-gray-700">{appointment.appointmentDate}</td>
                <td className="p-3 text-right text-gray-700">{appointment.service}</td>
                <td className="p-3 text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'تایید شده'
                        ? 'bg-green-100 text-green-700'
                        : appointment.status === 'در انتظار'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {appointment.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => openModal(appointment)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  >
                    جزئیات
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* مودال جزئیات */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm sm:max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-center">جزئیات نوبت</h3>
            <div className="space-y-2 text-right">
              <p><span className="font-medium">نام بیمار:</span> {selectedAppointment.patientName}</p>
              <p><span className="font-medium">سن:</span> {selectedAppointment.age}</p>
              <p><span className="font-medium">جنسیت:</span> {selectedAppointment.gender}</p>
              <p><span className="font-medium">شماره تماس:</span> {selectedAppointment.phone}</p>
              <p><span className="font-medium">تاریخ نوبت:</span> {selectedAppointment.appointmentDate}</p>
              <p><span className="font-medium">ساعت نوبت:</span> {selectedAppointment.appointmentTime}</p>
              <p><span className="font-medium">نوع سرویس:</span> {selectedAppointment.service}</p>
              <p><span className="font-medium">وضعیت:</span> {selectedAppointment.status}</p>
              <p><span className="font-medium">یادداشت‌ها:</span> {selectedAppointment.notes}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




export { ProfileInfo, Appointments, MedicalRecords, Settings };