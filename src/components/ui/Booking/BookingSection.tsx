import { useState, useEffect, useRef } from 'react';
import { getAvailableTimes, registerAppointment } from '../../../services/scheduleApi';
import Button from '../Button';
import LoginForm from '../login/Loginform';
// import PaymentModal from './PaymentModal';
import { HiOutlineClock, HiOutlineCalendar, HiOutlineCheckCircle, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineX, HiOutlineExclamationCircle, HiOutlineCreditCard } from 'react-icons/hi';


interface Service {
  id: number;
  price: number;
  discount_price: number;
  title: string;
  doctor?: {
    id: number;
  };
}

interface BookingSectionProps {
  doctorId?: number;
  serviceId: number;
  service?: Service;
}

interface TimeSlot {
   start_time: string;
   end_time: string;
}

interface AppointmentSlot {
   start_time: string;
   end_time: string;
   display_time: string;
}

const BookingSection = ({ doctorId, serviceId, service }: BookingSectionProps) => {
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(null);
    const [availableTimes, setAvailableTimes] = useState<AppointmentSlot[]>([]);
    const [selectedTime, setSelectedTime] = useState<AppointmentSlot | null>(null);
    const [bookingStatus, setBookingStatus] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [loadingTimes, setLoadingTimes] = useState(false);
    const [availableDays, setAvailableDays] = useState<Date[]>([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const formRef = useRef<HTMLDivElement>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [bookingData, setBookingData] = useState<any>(null);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

   // Function to disable past dates
   const isDateDisabled = (date: any) => {
     const today = new Date();
     today.setHours(0, 0, 0, 0); // Reset time to start of day

     // Convert Persian date to Gregorian for comparison
     if (date && date.year && date.month && date.day) {
       // For Persian calendar, we need to convert to Gregorian
       // For simplicity, we'll use a basic check
       const selectedDate = new Date(date.year, date.month - 1, date.day);
       return selectedDate < today;
     }

     return false;
   };

   // Function to break down time slots into appointment slots
   const generateAppointmentSlots = (timeSlots: TimeSlot[], serviceTime: number = 60, selectedDate?: string): AppointmentSlot[] => {
     const appointmentSlots: AppointmentSlot[] = [];

     timeSlots.forEach(slot => {
       // Extract time part from API response (format: "2025-08-29 09:30:00")
       const startTimeParts = slot.start_time.split(' ');
       const endTimeParts = slot.end_time.split(' ');

       if (startTimeParts.length === 2 && endTimeParts.length === 2) {
         const startTimeStr = startTimeParts[1]; // "09:30:00"
         const endTimeStr = endTimeParts[1]; // "17:00:00"

         // Create Date objects with selected date and API times
         const startDateTime = new Date(`${selectedDate}T${startTimeStr}`);
         const endDateTime = new Date(`${selectedDate}T${endTimeStr}`);

         // Calculate how many full appointment slots fit in this time range
         const timeDiff = endDateTime.getTime() - startDateTime.getTime(); // in milliseconds
         const serviceTimeMs = serviceTime * 60000; // convert minutes to milliseconds

         // Only generate slots if there's enough time for at least one full appointment
         if (timeDiff >= serviceTimeMs) {
           const maxSlots = Math.floor(timeDiff / serviceTimeMs);

           for (let i = 0; i < maxSlots; i++) {
             const slotStartTime = new Date(startDateTime.getTime() + (i * serviceTimeMs));
             const slotEndTime = new Date(slotStartTime.getTime() + serviceTimeMs);

             // Only add if the slot end time doesn't exceed the available time slot
             if (slotEndTime <= endDateTime) {
               // Format as expected by API: "YYYY-MM-DD HH:mm:ss"
               const startTimeFormatted = slotStartTime.getFullYear() + '-' +
                 String(slotStartTime.getMonth() + 1).padStart(2, '0') + '-' +
                 String(slotStartTime.getDate()).padStart(2, '0') + ' ' +
                 String(slotStartTime.getHours()).padStart(2, '0') + ':' +
                 String(slotStartTime.getMinutes()).padStart(2, '0') + ':' +
                 String(slotStartTime.getSeconds()).padStart(2, '0');

               const endTimeFormatted = slotEndTime.getFullYear() + '-' +
                 String(slotEndTime.getMonth() + 1).padStart(2, '0') + '-' +
                 String(slotEndTime.getDate()).padStart(2, '0') + ' ' +
                 String(slotEndTime.getHours()).padStart(2, '0') + ':' +
                 String(slotEndTime.getMinutes()).padStart(2, '0') + ':' +
                 String(slotEndTime.getSeconds()).padStart(2, '0');

               appointmentSlots.push({
                 start_time: startTimeFormatted,
                 end_time: endTimeFormatted,
                 display_time: `${slotStartTime.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })} - ${slotEndTime.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`
               });
             }
           }
         }
       }
     });

     return appointmentSlots;
   };

  // Generate available days (next 14 days)
  useEffect(() => {
    const generateAvailableDays = () => {
      const days = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push(date);
      }
      setAvailableDays(days);
    };

    generateAvailableDays();
  }, []);

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

  // Handle day selection from horizontal selector
  const handleDaySelect = async (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      setBookingStatus("نمی‌توانید تاریخ گذشته را انتخاب کنید");
      setTimeout(() => setBookingStatus(null), 3000);
      return;
    }

    // Create Persian date object for the DatePicker
    const persianDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };

    setSelectedDate(persianDate);
    setSelectedDateObj(date);
    setSelectedTime(null);
    setShowForm(false);
    setLoadingTimes(true);

    if (doctorId) {
      try {
        const finalDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        // console.log("Sending request to getAvailableTimes with:", {
        //   user_id: doctorId,
        //   service_id: serviceId,
        //   date: finalDate,
        // });

        const response = await getAvailableTimes(doctorId, serviceId, finalDate);
        // console.log("getAvailableTimes response:", response);

        if (response.data.length === 0) {
          setBookingStatus("برای این تاریخ نوبتی موجود نیست");
          setAvailableTimes([]);
          setLoadingTimes(false);
          setTimeout(() => setBookingStatus(null), 3000);
        } else {
          const serviceTime = response.data[0]?.services[0]?.time || 60;
          const appointmentSlots = generateAppointmentSlots(response.data, serviceTime, finalDate);
          setAvailableTimes(appointmentSlots);
          setLoadingTimes(false);
        }
      } catch (error: any) {
        console.error("Error in handleDaySelect:", error.message, error);
        setBookingStatus(`خطا در دریافت نوبت‌های موجود: ${error.message}`);
        setTimeout(() => setBookingStatus(null), 3000);
        setLoadingTimes(false);
      }
    } else {
      setAvailableTimes([]);
      setLoadingTimes(false);
      setBookingStatus("شناسه پزشک نامعتبر است");
      setTimeout(() => setBookingStatus(null), 3000);
    }
  };

const handleDateSelect = async (date: any) => {
    // console.log("Clicked date raw:", date);

    // Check if selected date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let selectedDateObj: Date;
    if (date._i) {
      const rawDate = date._i;
      const cleanDate = rawDate.replace(/-+$/, "");
      selectedDateObj = new Date(cleanDate);
    } else if (date.year && date.month && date.day) {
      selectedDateObj = new Date(date.year, date.month - 1, date.day);
    } else {
      setBookingStatus("فرمت تاریخ نامعتبر است");
      setTimeout(() => setBookingStatus(null), 3000);
      return;
    }

    if (selectedDateObj < today) {
      setBookingStatus("نمی‌توانید تاریخ گذشته را انتخاب کنید");
      setTimeout(() => setBookingStatus(null), 3000);
      return;
    }

    setSelectedDate(date);
    setSelectedDateObj(selectedDateObj);
    setSelectedTime(null);
    setShowForm(false);
    setLoadingTimes(true);

   if (date && doctorId) {
     try {
       // Get the date in YYYY-MM-DD format from the Persian date picker
       let finalDate: string;

       if (date._i) {
         // If _i exists, use it (Persian date picker format)
         const rawDate = date._i;
         const cleanDate = rawDate.replace(/-+$/, "");
         finalDate = cleanDate;
       } else if (date.year && date.month && date.day) {
         // Fallback: construct date from year, month, day
         finalDate = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
       } else {
         throw new Error("Invalid date format");
       }

       // console.log("Converted date:", finalDate);

      // ارسال درخواست با تاریخ جدید
      // console.log("Sending request to getAvailableTimes with:", {
      //   user_id: doctorId,
      //   service_id: serviceId,
      //   date: finalDate,
      // });

      const response = await getAvailableTimes(doctorId, serviceId, finalDate);
      // console.log("getAvailableTimes response:", response);

      if (response.data.length === 0) {
        setBookingStatus("برای این تاریخ نوبتی موجود نیست");
        setAvailableTimes([]);
        setLoadingTimes(false);
        setTimeout(() => setBookingStatus(null), 3000);
      } else {
        // Extract service time from the first service (assuming all services in the slot have the same time)
        const serviceTime = response.data[0]?.services[0]?.time || 60;

        // Break down time slots into appointment slots using the actual service time and selected date
        const appointmentSlots = generateAppointmentSlots(response.data, serviceTime, finalDate);
        setAvailableTimes(appointmentSlots);
        setLoadingTimes(false);
      }
    } catch (error: any) {
      console.error("Error in handleDateSelect:", error.message, error);
      setBookingStatus(`خطا در دریافت نوبت‌های موجود: ${error.message}`);
      setTimeout(() => setBookingStatus(null), 3000);
      setLoadingTimes(false);
    }
  } else {
    setAvailableTimes([]);
    setLoadingTimes(false);
    if (!doctorId) {
      setBookingStatus("شناسه پزشک نامعتبر است");
      setTimeout(() => setBookingStatus(null), 3000);
    }
  }
};



  const handleTimeSelect = (time: AppointmentSlot) => {
    // console.log("Selected time:", time);
    // console.log("Start time:", time.start_time);
    // console.log("End time:", time.end_time);
    setSelectedTime(time);
    setShowForm(true);

    // Auto-scroll to booking form
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedTime && doctorId && user?.id) {
      // console.log("Booking with time:", selectedTime);
      // console.log("Sending to API:", {
      //   user_id: doctorId,
      //   service_id: serviceId,
      //   patient_id: user.id,
      //   start_date: selectedTime.start_time,
      //   end_date: selectedTime.end_time,
      //   description,
      //   attachments: []
      // });

      try {
        // console.log('📤 Sending booking request:', {
        //   user_id: doctorId,
        //   service_id: serviceId,
        //   patient_id: user.id,
        //   start_date: selectedTime.start_time,
        //   end_date: selectedTime.end_time,
        //   description,
        //   attachments: []
        // });

        const response = await registerAppointment({
          user_id: doctorId,
          service_id: serviceId,
          patient_id: user.id,
          start_date: selectedTime.start_time,
          end_date: selectedTime.end_time,
          description,
          attachments: [], // ارسال آرایه خالی به جای null
        });

        // console.log('📥 Booking response:', response);
        // console.log('📋 Appointment details:', response.appointment);

        // Calculate the correct payment amount
        const paymentAmount = service && service.discount_price > 0 && service.discount_price < service.price
          ? service.discount_price
          : service?.price || 2000000;

        // console.log('💰 Calculated payment amount:', paymentAmount);

        // Store booking data for payment modal
        setBookingData({
          appointmentId: response.appointment.id,
          amount: paymentAmount,
          serviceTitle: service?.title || 'خدمت پزشکی',
          doctorName: service?.doctor ? `دکتر ${service.doctor.id}` : 'دکتر',
          appointmentDate: selectedDateObj?.toLocaleDateString('fa-IR'),
          appointmentTime: selectedTime.display_time
        });

        setShowForm(false);
        setDescription('');
        setShowPaymentModal(true);
      } catch (error: any) {
        console.error('❌ Booking error:', error);
        console.error('❌ Error response:', error.response?.data);
        setBookingStatus(`خطا در ثبت نوبت: ${error.message}`);
        setTimeout(() => setBookingStatus(null), 3000);
      }
    } else {
      setBookingStatus('لطفاً تاریخ، ساعت و توضیحات را وارد کنید');
      setTimeout(() => setBookingStatus(null), 3000);
    }
  };


  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-200">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-red-600 mb-3 sm:mb-4">نیاز به ورود</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
          برای رزرو نوبت، لطفاً ابتدا وارد حساب کاربری خود شوید.
        </p>
        <LoginForm role="patient" redirectPath={`/service/${serviceId}`} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-200">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">رزرو نوبت</h2>

      {/* Calendar Toggle Button */}
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm sm:text-base"
        >
          <HiOutlineCalendar className="text-base sm:text-lg" />
          {showCalendar ? 'بستن تقویم' : 'انتخاب تاریخ از تقویم'}
        </button>
      </div>

      {/* Custom Calendar (when toggled) */}
      {showCalendar && (
        <div className="mb-4 sm:mb-6 bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <button
              onClick={() => {
                const newMonth = new Date(currentMonth);
                newMonth.setMonth(newMonth.getMonth() - 1);
                setCurrentMonth(newMonth);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <HiOutlineChevronRight className="text-lg sm:text-xl" />
            </button>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              {currentMonth.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long' })}
            </h3>
            <button
              onClick={() => {
                const newMonth = new Date(currentMonth);
                newMonth.setMonth(newMonth.getMonth() + 1);
                setCurrentMonth(newMonth);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <HiOutlineChevronLeft className="text-lg sm:text-xl" />
            </button>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map(day => (
              <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {(() => {
              const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
              const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
              const startDate = new Date(firstDay);
              startDate.setDate(startDate.getDate() - firstDay.getDay());

              const days = [];
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              for (let i = 0; i < 42; i++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + i);

                const isCurrentMonth = currentDate.getMonth() === currentMonth.getMonth();
                const isToday = currentDate.toDateString() === today.toDateString();
                const isPast = currentDate < today && !isToday;
                const isSelected = selectedDateObj?.toDateString() === currentDate.toDateString();

                days.push(
                  <button
                    key={i}
                    onClick={() => !isPast && handleDateSelect({
                      year: currentDate.getFullYear(),
                      month: currentDate.getMonth() + 1,
                      day: currentDate.getDate()
                    })}
                    disabled={isPast}
                    className={`h-8 w-8 sm:h-10 sm:w-10 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                      !isCurrentMonth
                        ? 'text-gray-300 cursor-not-allowed'
                        : isSelected
                        ? 'bg-blue-500 text-white shadow-lg'
                        : isPast
                        ? 'text-gray-300 cursor-not-allowed'
                        : isToday
                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {currentDate.getDate()}
                  </button>
                );
              }
              return days;
            })()}
          </div>
        </div>
      )}

      {/* Horizontal Day Selector */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
          <HiOutlineCalendar className="text-blue-500 text-base sm:text-lg" />
          انتخاب روز
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {availableDays.map((day, index) => {
            const isSelected = selectedDateObj?.toDateString() === day.toDateString();
            const isToday = day.toDateString() === new Date().toDateString();
            const isPast = day < new Date() && !isToday;

            return (
              <button
                key={index}
                onClick={() => !isPast && handleDaySelect(day)}
                disabled={isPast}
                className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                  isSelected
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-blue-500 shadow-lg'
                    : isPast
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className={`text-xs font-medium ${isSelected ? 'text-blue-100' : isPast ? 'text-gray-400' : 'text-gray-500'}`}>
                    {day.toLocaleDateString('fa-IR', { weekday: 'short' })}
                  </span>
                  <span className={`text-lg font-bold ${isSelected ? 'text-white' : isPast ? 'text-gray-400' : 'text-gray-800'}`}>
                    {day.getDate()}
                  </span>
                  {isToday && !isSelected && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded">امروز</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Appointments Section */}
      <div className="space-y-6">
        {selectedDate ? (
          loadingTimes ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-100">
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-t-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-base sm:text-lg font-semibold text-blue-700 mb-2">در حال بارگذاری نوبت‌ها</h3>
                <p className="text-blue-600 text-xs sm:text-sm">لطفاً کمی صبر کنید...</p>
              </div>
            </div>
          ) : availableTimes.length > 0 ? (
            <>
              {/* Enhanced Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <HiOutlineCalendar className="text-lg sm:text-xl md:text-2xl" />
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">نوبت های موجود</h3>
                </div>
                <p className="text-blue-100 text-xs sm:text-sm">
                  {selectedDateObj ? selectedDateObj.toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                </p>
              </div>

              {/* Time Slots Grid */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <HiOutlineClock className="text-blue-500 text-base sm:text-lg" />
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800">ساعات نوبت</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {availableTimes.map((time, index) => (
                    <button
                      key={index}
                      onClick={() => handleTimeSelect(time)}
                      className={`group relative p-3 sm:p-4 rounded-xl text-center transition-all duration-200 transform hover:scale-105 ${
                        selectedTime?.start_time === time.start_time
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:shadow-md border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <HiOutlineClock className={`text-xs sm:text-sm ${selectedTime?.start_time === time.start_time ? 'text-blue-100' : 'text-blue-500'}`} />
                        <span className="font-medium text-xs sm:text-sm">{time.display_time}</span>
                      </div>
                      {selectedTime?.start_time === time.start_time && (
                        <HiOutlineCheckCircle className="absolute -top-1 -right-1 text-white bg-green-500 rounded-full p-1 text-xs" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Booking Form */}
              {showForm && (
                <div ref={formRef} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">تکمیل رزرو نوبت</h4>
                  <form onSubmit={handleBooking} className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2 text-xs sm:text-sm font-medium">توضیحات (اختیاری)</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 sm:p-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-xs sm:text-sm resize-none"
                        rows={3}
                        placeholder="اگر توضیح خاصی دارید، اینجا بنویسید..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-500 rounded-full to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 px-4 sm:px-6 py-3 sm:py-4 font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <HiOutlineCheckCircle className="text-base sm:text-lg" />
                        ثبت نوبت
                      </div>
                    </button>
                  </form>
                </div>
              )}

              {/* Status Message */}
              {bookingStatus && (
                <div className={`rounded-xl p-3 sm:p-4 text-center text-xs sm:text-sm font-medium ${
                  bookingStatus.includes('موفقیت') || bookingStatus.includes('ثبت')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {bookingStatus}
                </div>
              )}
            </>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 sm:p-8 border border-gray-200 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiOutlineCalendar className="text-gray-400 text-lg sm:text-2xl" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">نوبتی موجود نیست</h3>
              <p className="text-gray-500 text-xs sm:text-sm">برای این تاریخ هیچ نوبتی تعریف نشده است</p>
            </div>
          )
        ) : (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-100 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineCalendar className="text-blue-500 text-lg sm:text-2xl" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-blue-700 mb-2">انتخاب تاریخ</h3>
            <p className="text-blue-600 text-xs sm:text-sm">ابتدا تاریخ مورد نظر خود را انتخاب کنید</p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && bookingData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-sm sm:max-w-md w-full mx-3 sm:mx-4 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <HiOutlineCheckCircle className="text-green-600 text-lg sm:text-xl" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">نوبت رزرو شد!</h2>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <HiOutlineX className="text-lg sm:text-xl" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiOutlineCheckCircle className="text-green-600 text-2xl sm:text-3xl" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                  نوبت شما با موفقیت رزرو شد
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  برای تکمیل فرآیند، لطفاً پرداخت را انجام دهید
                </p>
              </div>

              {/* Appointment Details */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">جزئیات نوبت</h4>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">تاریخ:</span>
                    <span className="font-medium">{bookingData.appointmentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ساعت:</span>
                    <span className="font-medium">{bookingData.appointmentTime}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600">مبلغ:</span>
                    <span className="font-bold text-blue-600">
                      {bookingData.amount.toLocaleString()} تومان
                    </span>
                  </div>
                </div>
              </div>

              {/* VPN Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex items-start gap-2 sm:gap-3">
                  <HiOutlineExclamationCircle className="text-yellow-600 text-base sm:text-lg mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1 text-sm sm:text-base">توجه مهم</h4>
                    <p className="text-yellow-700 text-xs sm:text-sm">
                      اگر از VPN استفاده می‌کنید، لطفاً آن را خاموش کنید تا فرآیند پرداخت به درستی انجام شود.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={async () => {
                  setIsPaymentProcessing(true);

                  try {
                    // Recalculate amount to ensure we have the latest discount info
                    const currentAmount = service && service.discount_price > 0 && service.discount_price < service.price
                      ? service.discount_price
                      : service?.price || bookingData.amount;

                    // console.log('💳 Sending payment request:', {
                    //   amount: currentAmount,
                    //   appointment_id: bookingData.appointmentId
                    // });

                    const response = await fetch('https://api.niloudarman.ir/api/payment/request', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authData') ? JSON.parse(localStorage.getItem('authData')!).token : ''}`
                      },
                      body: JSON.stringify({
                        amount: currentAmount,
                        appointment_id: bookingData.appointmentId
                      })
                    });

                    const data = await response.json();
                    // console.log('💳 Payment response:', data);

                    if (data.success && data.url) {
                      // console.log('✅ Payment URL received:', data.url);
                      // Show processing for 2 seconds then redirect
                      setTimeout(() => {
                        window.location.href = data.url;
                      }, 2000);
                    } else {
                      console.error('❌ Payment request failed:', data);
                      alert('خطا در ایجاد درخواست پرداخت');
                      setIsPaymentProcessing(false);
                    }
                  } catch (error) {
                    console.error('❌ Payment error:', error);
                    alert('خطا در اتصال به سرور پرداخت');
                    setIsPaymentProcessing(false);
                  }
                }}
                disabled={isPaymentProcessing}
                className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-sm sm:text-base md:text-lg transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 ${
                  isPaymentProcessing
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 shadow-lg'
                }`}
              >
                {isPaymentProcessing ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    در حال انتقال...
                  </>
                ) : (
                  <>
                    <HiOutlineCreditCard className="text-lg sm:text-xl" />
                    پرداخت {bookingData.amount.toLocaleString()} تومان
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default BookingSection;