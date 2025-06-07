import React, { useState, useEffect } from 'react';
import { HiOutlinePlusCircle, HiOutlineTrash , HiChevronDown , HiChevronUp } from 'react-icons/hi2';
import type { CreateSchedulesRequest, ScheduleData, ScheduleTime, Service } from '../../../../../types/types';
import { createSchedules, getServices, getUserTimes } from '../../../../../services/serverapi';
import { cacheUserTimes } from '../Clinices/ClinicDataManager.ts';
import Select from 'react-select';

interface AddScheduleModalProps {
  userId: number;
  clinicId: number;
  isOpen: boolean;
  onClose: () => void;
  onScheduleCreate: (clinicId: number, userId: number) => void;
}

const AddScheduleModal: React.FC<AddScheduleModalProps> = ({ userId, clinicId, isOpen, onClose, onScheduleCreate }) => {
  const [schedules, setSchedules] = useState<
    { weekdays: string[]; times: ScheduleTime[] }[]
  >([{ weekdays: [], times: [{ clinic_id: clinicId, start_date: '', end_date: '', services: [] }] }]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [expandedAccordion, setExpandedAccordion] = useState<number | null>(0);
  const [newDayIndex, setNewDayIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const weekdays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await getServices();
        setServices(response.data);
      } catch (err) {
        setErrorMessage('خطا در بارگذاری خدمات');
      }
    };
    loadServices();
  }, []);

  const handleAddTimeSlot = (index: number) => {
    const newSchedules = [...schedules];
    newSchedules[index].times.push({ clinic_id: clinicId, start_date: '', end_date: '', services: [] });
    setSchedules(newSchedules);
  };

  const handleDeleteTimeSlot = (dayIndex: number, timeIndex: number) => {
    const newSchedules = [...schedules];
    newSchedules[dayIndex].times = newSchedules[dayIndex].times.filter((_, i) => i !== timeIndex);
    if (newSchedules[dayIndex].times.length === 0) {
      newSchedules[dayIndex].times.push({ clinic_id: clinicId, start_date: '', end_date: '', services: [] });
    }
    setSchedules(newSchedules);
  };

  const handleAddDay = () => {
    const newIndex = schedules.length;
    setSchedules([
      ...schedules,
      { weekdays: [], times: [{ clinic_id: clinicId, start_date: '', end_date: '', services: [] }] },
    ]);
    setNewDayIndex(newIndex);
    setExpandedAccordion(newIndex);
    setTimeout(() => setNewDayIndex(null), 300);
  };

  const handleDeleteDay = (index: number) => {
    const newSchedules = schedules.filter((_, i) => i !== index);
    setSchedules(newSchedules);
    setSelectedDays(newSchedules.flatMap((s) => s.weekdays));
    if (expandedAccordion === index) {
      setExpandedAccordion(newSchedules.length > 0 ? 0 : null);
    }
  };

  const formatTimeToHHMMSS = (time: string): string => {
    if (!time) return '';
    const regex = /^(\d{1,2}):(\d{2})$/;
    const match = time.match(regex);
    if (!match) return '';
    const [, hours, minutes] = match;
    return `${hours.padStart(2, '0')}:${minutes}:00`;
  };

  const formatDisplayTime = (time: string): string => {
    if (!time) return '';
    return time.slice(0, 5); // HH:mm
  };

  const handleTimeChange = (
    dayIndex: number,
    timeIndex: number,
    field: keyof ScheduleTime,
    value: string
  ) => {
    const newSchedules = [...schedules];
    if (field === 'start_date' || field === 'end_date') {
      newSchedules[dayIndex].times[timeIndex][field] = formatTimeToHHMMSS(value);
    }
    setSchedules(newSchedules);
  };

  const handleServiceChange = (
    dayIndex: number,
    timeIndex: number,
    value: number[]
  ) => {
    const newSchedules = [...schedules];
    newSchedules[dayIndex].times[timeIndex].services = value;
    setSchedules(newSchedules);
  };

  const handleWeekdayChange = (index: number, day: string, checked: boolean) => {
    const newSchedules = [...schedules];
    if (checked) {
      newSchedules[index].weekdays = [...newSchedules[index].weekdays, day];
    } else {
      newSchedules[index].weekdays = newSchedules[index].weekdays.filter((d) => d !== day);
    }
    setSchedules(newSchedules);
    setSelectedDays(newSchedules.flatMap((s) => s.weekdays));
  };

  const validateSchedules = (schedules: { weekdays: string[]; times: ScheduleTime[] }[]): boolean => {
    for (const schedule of schedules) {
      if (schedule.weekdays.length === 0) {
        setErrorMessage('حداقل یک روز هفته باید انتخاب شود.');
        return false;
      }
      for (const time of schedule.times) {
        if (!time.start_date || !time.end_date) {
          setErrorMessage('ساعت شروع و پایان برای تمام بازه‌های زمانی الزامی است.');
          return false;
        }
        if (!/^\d{2}:\d{2}:\d{2}$/.test(time.start_date) || !/^\d{2}:\d{2}:\d{2}$/.test(time.end_date)) {
          setErrorMessage('فرمت ساعت باید به صورت HH:mm:ss باشد.');
          return false;
        }
        if (time.services.length === 0) {
          setErrorMessage('حداقل یک سرویس برای هر بازه زمانی باید انتخاب شود.');
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const filteredSchedules = schedules
      .map((schedule) => ({
        ...schedule,
        times: schedule.times.filter(
          (time) => time.start_date && time.end_date && time.services.length > 0
        ),
      }))
      .filter((schedule) => schedule.weekdays.length > 0 && schedule.times.length > 0);

    if (filteredSchedules.length === 0) {
      setErrorMessage('حداقل یک روز و یک بازه زمانی معتبر باید وارد شود.');
      setIsSubmitting(false);
      return;
    }

    if (!validateSchedules(filteredSchedules)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const payload: CreateSchedulesRequest = {
        user_id: userId,
        data: filteredSchedules.flatMap((schedule) =>
          schedule.weekdays.map((weekday) => ({
            weekday,
            times: schedule.times,
          }))
        ),
      };
      const response = await createSchedules(payload);
      setSuccessMessage(response.message);

      localStorage.removeItem(`user_times_cache_${userId}`);
      const timesResponse = await getUserTimes(userId);
      cacheUserTimes(userId, timesResponse);

      onScheduleCreate(clinicId, userId);
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'خطا در ثبت زمان‌بندی');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    const confirmed = window.confirm('آیا مطمئن هستید که می‌خواهید مودال را ببندید؟ تغییرات ذخیره نشده از بین خواهند رفت.');
    if (confirmed) {
      onClose();
    }
  };

  const toggleAccordion = (index: number) => {
    setExpandedAccordion(expandedAccordion === index ? null : index);
  };

  const availableWeekdays = (index: number) =>
    weekdays.filter((day) => !selectedDays.includes(day) || schedules[index].weekdays.includes(day));

  const serviceOptions = services.map((service) => ({
    value: service.id,
    label: service.title,
  }));

  const getDayLabel = (day: string) => {
    return {
      Saturday: 'شنبه',
      Sunday: 'یک‌شنبه',
      Monday: 'دوشنبه',
      Tuesday: 'سه‌شنبه',
      Wednesday: 'چهارشنبه',
      Thursday: 'پنج‌شنبه',
      Friday: 'جمعه',
    }[day];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-25">
      <div className="w-full max-w-2xl h-[85vh] flex flex-col rounded-2xl bg-white text-right shadow-xl overflow-hidden">
        <div className="p-6 pb-0">
          <h3 className="text-lg font-medium text-gray-900">افزودن زمان‌بندی</h3>
        </div>
        <style>
          {`
            .accordion-content {
              max-height: 0;
              opacity: 0;
              overflow: hidden;
              transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
            }
            .accordion-content.open {
              max-height: 1000px;
              opacity: 1;
            }
            .weekday-button {
              padding: 6px 12px;
              border-radius: 8px;
              border: 1px solid #d1d5db;
              background-color: #f3f4f6;
              color: #374151;
              font-size: 0.75rem;
              transition: all 0.2s ease;
            }
            .weekday-button.selected {
              background-color: #4f46e5;
              color: white;
              border-color: #4f46e5;
            }
            .weekday-button:hover {
              background-color: #e0e7ff;
            }
            .weekday-button.selected:hover {
              background-color: #4338ca;
            }
            .new-day {
              opacity: 0;
              transform: translateY(20px);
              transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
            }
            .new-day.show {
              opacity: 1;
              transform: translateY(0);
            }
            .input-field {
              width: 100%;
              padding: 8px;
              border: 1px solid #d1d5db;
              border-radius: 6px;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
              font-size: 0.75rem;
              transition: border-color 0.2s ease-in-out;
            }
            .input-field:focus {
              outline: none;
              border-color: #4f46e5;
              box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
            }
            .loading-spinner {
              display: inline-block;
              width: 1rem;
              height: 1rem;
              border: 2px solid #ffffff;
              border-top: 2px solid transparent;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin-left: 8px;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            .message {
              font-size: 0.75rem;
              margin-right: 8px;
            }
            .error {
                color: #dc2626;
                background-color: #ffd4d4;
                padding: 5px;
                border-radius: 5px;

            }
            .success {
              color: #16a34a;
            }
          `}
        </style>
        <div className="flex-1 overflow-y-auto p-6">
          {schedules.map((schedule, index) => (
            <div
              key={index}
              className={`border rounded-lg mb-4 overflow-auto ${newDayIndex === index ? 'new-day show' : ''}`}
            >
              <button
                type="button"
                className="w-full flex justify-between items-center p-4 bg-gray-100 rounded-t-lg"
                onClick={() => toggleAccordion(index)}
              >
                <span>
                  {schedule.weekdays.length > 0
                    ? schedule.weekdays.map(getDayLabel).join(', ')
                    : 'روزهای انتخاب‌شده'}
                </span>
                <div className="flex gap-2 items-center justify-center">
                  <HiOutlineTrash
                    className="text-red-500 hover:text-red-600s bg-red-100 hover:bg-red-300 rounded-lg p-2 text-3xl cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDay(index);
                    }}
                  />
                  <span>{expandedAccordion === index ? <HiChevronUp /> : <HiChevronDown />}</span>
                </div>
              </button>
              <div className={`accordion-content ${expandedAccordion === index ? 'open' : ''}`}>
                <div className="p-4">
                  <div className="mb-4 flex items-center gap-2 justify-start">
                    <div className="flex flex-wrap gap-2 mt-2">
                      {availableWeekdays(index).map((day) => (
                        <button
                          key={day}
                          type="button"
                          className={`weekday-button ${schedule.weekdays.includes(day) ? 'selected' : ''}`}
                          onClick={() => handleWeekdayChange(index, day, !schedule.weekdays.includes(day))}
                        >
                          {getDayLabel(day)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-8 text-sm gap-4 mb-4 mt-6">
                    <div className="col-span-2">ساعت شروع</div>
                    <div className="col-span-2">ساعت پایان</div>
                    <div className="col-span-4">سرویس‌ها</div>
                    {schedule.times.map((time, timeIndex) => (
                      <React.Fragment key={timeIndex}>
                        <div className="col-span-2">
                          <input
                            type="time"
                            value={time.start_date ? formatDisplayTime(time.start_date) : ''}
                            onChange={(e) => handleTimeChange(index, timeIndex, 'start_date', e.target.value)}
                            className="input-field"
                            step="60"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="time"
                            value={time.end_date ? formatDisplayTime(time.end_date) : ''}
                            onChange={(e) => handleTimeChange(index, timeIndex, 'end_date', e.target.value)}
                            className="input-field"
                            step="60"
                          />
                        </div>
                        <div className="col-span-4 flex items-center gap-2">
                          <Select
                            isMulti
                            options={serviceOptions}
                            value={serviceOptions.filter((option) => time.services.includes(option.value))}
                            onChange={(selected) =>
                              handleServiceChange(index, timeIndex, selected.map((option) => option.value))
                            }
                            placeholder="انتخاب سرویس‌ها"
                            className="flex-1 text-right"
                            classNamePrefix="react-select"
                            styles={{
                              control: (base) => ({
                                ...base,
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                                fontSize: '0.75rem',
                                '&:hover': { borderColor: '#4f46e5' },
                                '&:focus-within': {
                                  borderColor: '#4f46e5',
                                  boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
                                },
                              }),
                              menu: (base) => ({ ...base, textAlign: 'right', fontSize: '0.75rem' }),
                              option: (base) => ({ ...base, fontSize: '0.75rem' }),
                              multiValue: (base) => ({ ...base, fontSize: '0.75rem' }),
                              multiValueLabel: (base) => ({ ...base, fontSize: '0.75rem' }),
                              multiValueRemove: (base) => ({ ...base, fontSize: '0.75rem' }),
                            }}
                          />
                          {schedule.times.length > 1 && (
                            <HiOutlineTrash
                              className="text-red-500 hover:text-red-600 cursor-pointer"
                              onClick={() => handleDeleteTimeSlot(index, timeIndex)}
                            />
                          )}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddTimeSlot(index)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-transparent  px-4 py-2 text-sm font-medium text-primary hover:bg-gray-100"
                  >
                    <HiOutlinePlusCircle className="text-xl" />
                    افزودن بازه زمانی
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddDay}
            className="inline-flex items-center w-full justify-center gap-2 rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200"
          >
            <HiOutlinePlusCircle className="text-xl" />
            افزودن روز جدید
          </button>
        </div>
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex justify-between w-full gap-4  items-center">
            <div className='w-2/3 '>
                {errorMessage && (
                <span className="message error">{errorMessage}</span>
                )}
                {successMessage && (
                <span className="message success">{successMessage}</span>
                )}
            </div>
            <div className='flex gap-2 w-1/3'>
                <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                onClick={handleClose}
                >
                انصراف
                </button>
                <button
                type="button"
                className="inline-flex justify-center items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-400"
                onClick={handleSubmit}
                disabled={isSubmitting}
                >
                {isSubmitting ? (
                    <>
                    <span className="loading-spinner" />
                    در حال ثبت...
                    </>
                ) : (
                    'ثبت زمان‌بندی'
                )}
                </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddScheduleModal;