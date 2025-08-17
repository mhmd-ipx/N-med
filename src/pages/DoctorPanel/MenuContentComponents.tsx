import { useState, useEffect, type SetStateAction } from 'react';

import { HiOutlineUser, HiOutlinePhone, HiOutlineDocumentText, HiOutlineUserCircle } from 'react-icons/hi';
import Button from '../../components/ui/Button';

interface Referral {
  id: number;
  patientName: string;
  patientPhone: string;
  notes: string;
  referblueDoctor: string;
  createdAt: string;
}

const doctors = [
  { id: 1, name: 'دکتر علی مردانی' },
  { id: 2, name: 'دکتر رضا احمدی' },
  { id: 3, name: 'دکتر مریم حسینی' },
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
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">ارجاع بیمار</h1>
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
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <HiOutlineUser className="text-xl text-blue-500" />
                نام بیمار
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="نام بیمار را وارد کنید"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <HiOutlinePhone className="text-xl text-blue-500" />
                شماره همراه بیمار
              </label>
              <input
                type="tel"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0912XXXXXXX"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <HiOutlineDocumentText className="text-xl text-blue-500" />
                یادداشت
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="یادداشت برای بیمار"
                rows={4}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <HiOutlineUserCircle className="text-xl text-blue-500" />
                دکتر برای ارجاع
              </label>
              <select
                value={referblueDoctor}
                onChange={(e) => setReferblueDoctor(e.target.value)}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">یک دکتر انتخاب کنید</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.name}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="solid"
              size="lg"
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
              type="submit"
            >
              ثبت ارجاع
            </Button>
            {status && (
              <p className={`text-center mt-4 ${status.includes('موفقیت') ? 'text-green-500' : 'text-blue-500'}`}>
                {status}
              </p>
            )}
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">تاریخچه ارجاعات</h2>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-500 border-blue-500 hover:bg-blue-100"
                onClick={handleClearHistory}
              >
                پاک کردن تاریخچه
              </Button>
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