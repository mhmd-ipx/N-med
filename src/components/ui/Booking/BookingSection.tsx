import { useState, useEffect } from 'react';
import { DatePicker } from 'jalaali-react-date-picker';
import 'jalaali-react-date-picker/lib/styles/index.css';
import { getAvailableTimes, registerAppointment } from '../../../services/scheduleApi';
import Button from '../Button';
import LoginForm from '../login/Loginform';


interface BookingSectionProps {
  doctorId?: number;
  serviceId: number;
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

const BookingSection = ({ doctorId, serviceId }: BookingSectionProps) => {
   const [selectedDate, setSelectedDate] = useState<any>(null);
   const [availableTimes, setAvailableTimes] = useState<AppointmentSlot[]>([]);
   const [selectedTime, setSelectedTime] = useState<AppointmentSlot | null>(null);
   const [bookingStatus, setBookingStatus] = useState<string | null>(null);
   const [description, setDescription] = useState('');
   const [showForm, setShowForm] = useState(false);

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
   setSelectedTime(null);
   setShowForm(false);

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

       console.log("Converted date:", finalDate);

      // ارسال درخواست با تاریخ جدید
      console.log("Sending request to getAvailableTimes with:", {
        user_id: doctorId,
        service_id: serviceId,
        date: finalDate,
      });

      const response = await getAvailableTimes(doctorId, serviceId, finalDate);
      console.log("getAvailableTimes response:", response);

      if (response.data.length === 0) {
        setBookingStatus("برای این تاریخ نوبتی موجود نیست");
        setAvailableTimes([]);
        setTimeout(() => setBookingStatus(null), 3000);
      } else {
        // Extract service time from the first service (assuming all services in the slot have the same time)
        const serviceTime = response.data[0]?.services[0]?.time || 60;

        // Break down time slots into appointment slots using the actual service time and selected date
        const appointmentSlots = generateAppointmentSlots(response.data, serviceTime, finalDate);
        setAvailableTimes(appointmentSlots);
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



  const handleTimeSelect = (time: AppointmentSlot) => {
    console.log("Selected time:", time);
    console.log("Start time:", time.start_time);
    console.log("End time:", time.end_time);
    setSelectedTime(time);
    setShowForm(true);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedTime && doctorId && user?.id) {
      console.log("Booking with time:", selectedTime);
      console.log("Sending to API:", {
        user_id: doctorId,
        service_id: serviceId,
        patient_id: user.id,
        start_date: selectedTime.start_time,
        end_date: selectedTime.end_time,
        description,
        attachments: []
      });

      try {
        const response = await registerAppointment({
          user_id: doctorId,
          service_id: serviceId,
          patient_id: user.id,
          start_date: selectedTime.start_time,
          end_date: selectedTime.end_time,
          description,
          attachments: [], // ارسال آرایه خالی به جای null
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
            locale="fa"
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
                      {time.display_time}
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