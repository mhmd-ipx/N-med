import { useState, useEffect } from 'react';
import { DatePicker } from 'jalaali-react-date-picker';
import 'jalaali-react-date-picker/lib/styles/index.css';
import { getAvailableTimes, registerAppointment } from '../../../services/scheduleApi';
import Button from '../Button';
import LoginForm from '../login/Loginform';
import moment from "moment";


interface BookingSectionProps {
  doctorId?: number;
  serviceId: number;
}

interface TimeSlot {
  start_time: string;
  end_time: string;
}

const BookingSection = ({ doctorId, serviceId }: BookingSectionProps) => {
  const [selectedDate, setSelectedDate] = useState<{ year: number; month: number; day: number } | null>(null);
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Check login status
  const authData = localStorage.getItem('authData');
  let isLoggedIn = false;
  let user = null;
  let token = null;

  if (authData) {
    try {
      const parsedData = JSON.parse(authData);
      if (parsedData?.token && parsedData?.user?.id && parsedData?.user?.role === 'patient') {
        isLoggedIn = true;
        user = parsedData.user;
        token = parsedData.token;
      }
    } catch (error) {
      console.error('Error parsing authData from localStorage:', error);
    }
  }

const handleDateSelect = async (date: any) => {
  console.log("Clicked date raw:", date);

  setSelectedDate(date);
  setSelectedTime(null);
  setShowForm(false);

  if (date && doctorId) {
    try {
      // گرفتن مقدار اولیه مثل "2025-08-21---"
      const rawDate = date._i;

      // حذف --- اضافی → خروجی "2025-08-21"
      const cleanDate = rawDate.replace(/-+$/, "");

      // ساختن آبجکت Date
      const jsDate = new Date(cleanDate);

      // اضافه کردن 3 روز
      jsDate.setDate(jsDate.getDate() + 3);

      // تبدیل به فرمت YYYY-MM-DD
      const finalDate = jsDate.toISOString().split("T")[0]; // "2025-08-24"

      console.log("Converted date:", finalDate);

      // ارسال درخواست با تاریخ جدید
      console.log("Sending request to getAvailableTimes with:", {
        user_id: doctorId,
        service_id: serviceId,
        date: finalDate,
      });

      const response = await getAvailableTimes(1, serviceId, finalDate);
      console.log("getAvailableTimes response:", response);

      if (response.data.length === 0) {
        setBookingStatus("برای این تاریخ نوبتی موجود نیست");
        setAvailableTimes([]);
        setTimeout(() => setBookingStatus(null), 3000);
      } else {
        setAvailableTimes(response.data);
      }
    } catch (error: any) {
      console.error("Error in handleDateSelect:", error.message, error);
      setBookingStatus(`خطا در دریافت نوبت‌های موجود: ${error.message}`);
      setTimeout(() => setBookingStatus(null), 3000);
    }
  } else {
    setAvailableTimes([]);
    if (!doctorId) {
      setBookingStatus("شناسه پزشک نامعتبر است");
      setTimeout(() => setBookingStatus(null), 3000);
    }
  }
};



  const handleTimeSelect = (time: TimeSlot) => {
    setSelectedTime(time);
    setShowForm(true);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedTime && doctorId && user?.id) {
      try {
        const response = await registerAppointment({
          user_id: doctorId,
          service_id: serviceId,
          patient_id: user.id,
          start_date: selectedTime.start_time,
          end_date: selectedTime.end_time,
          description,
          attachments: null,
        });
        
        setBookingStatus(response.message);
        setShowForm(false);
        setDescription('');
        setTimeout(() => setBookingStatus(null), 3000);
      } catch (error: any) {
        setBookingStatus(`خطا در ثبت نوبت: ${error.message}`);
        setTimeout(() => setBookingStatus(null), 3000);
        console.error(error);
      }
    } else {
      setBookingStatus('لطفاً تاریخ، ساعت و توضیحات را وارد کنید');
      setTimeout(() => setBookingStatus(null), 3000);
    }
  };

  // Disable past dates
  const isDateDisabled = (date: { year: number; month: number; day: number }) => {
    const today = new Date();
    const selected = new Date(date.year, date.month - 1, date.day);
    return selected < today;
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-red-600 mb-4">نیاز به ورود</h2>
        <p className="text-gray-600 mb-4">
          برای رزرو نوبت، لطفاً ابتدا وارد حساب کاربری خود شوید.
        </p>
        <LoginForm role="patient" redirectPath={`/service/${serviceId}`} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 border border-gray-200">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">رزرو نوبت</h2>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="w-full lg:w-1/2">
          <DatePicker
            value={selectedDate}
            onChange={handleDateSelect}
            inputClassName="w-full p-3 rounded-lg border border-gray-300 text-sm md:text-base"
            wrapperClassName="custom-calendar"
            locale="fa"
            color="#ef4444"
            disabled={isDateDisabled}
          />
        </div>
        <div className="w-full lg:w-1/2">
          {selectedDate ? (
            availableTimes.length > 0 ? (
              <>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  نوبت‌های موجود
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3 md:gap-4 mb-6">
                  {availableTimes.map((time, index) => (
                    <button
                      key={index}
                      onClick={() => handleTimeSelect(time)}
                      className={`p-2 md:p-3 rounded-lg text-center text-sm md:text-base ${
                        selectedTime?.start_time === time.start_time
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                      }`}
                    >
                      {time.start_time.split(' ')[1].slice(0, 5)} -{' '}
                      {time.end_time.split(' ')[1].slice(0, 5)}
                    </button>
                  ))}
                </div>
                {showForm && (
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2 text-sm md:text-base">توضیحات</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 text-sm md:text-base"
                        rows={3}
                        placeholder="توضیحات خود را وارد کنید"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white hover:bg-blue-600 px-6 py-3 rounded-3xl font-medium transition-colors"
                    >
                      ثبت نوبت
                    </button>
                  </form>
                )}
                {bookingStatus && (
                  <p className={`mt-4 text-center text-sm md:text-base ${bookingStatus.includes('موفقیت') ? 'text-green-500' : 'text-blue-500'}`}>
                    {bookingStatus}
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-600 text-center py-8">برای این تاریخ نوبتی موجود نیست</p>
            )
          ) : (
            <p className="text-gray-600 text-center py-8">لطفاً یک تاریخ انتخاب کنید</p>
          )}
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
        .custom-calendar .rdp-day_disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default BookingSection;