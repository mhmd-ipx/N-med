import { useState, useEffect } from 'react';
import { fetchClinicsData, getCachedClinics, getCachedOperators, cacheOperators, cacheUserTimes, getCachedUserTimes } from '../Clinices/ClinicDataManager.ts';
import { getOperators, detachOperator, getUserTimes, getServices } from '../../../../../services/serverapi.ts';
import type { Clinic, ProfileInfoProps, Operator, CreateAndAssignOperatorResponse, UserTime, ServicesResponse, Service } from '../../../../../types/types.ts';
import { HiOutlineXMark, HiOutlineDevicePhoneMobile, HiOutlineBuildingOffice2, HiOutlineCalendar, HiOutlineTrash, HiUser, HiOutlinePlusCircle, HiOutlineClock, HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import SuccessPopup from '../../../../../components/ui/SuccessPopup.tsx';
import CreateOperatorModal from './CreateOperatorModal.tsx';
import AddScheduleModal from './AddScheduleModal.tsx';
import CancellationsModal from './CancellationsModal';
import EditScheduleModal from './EditScheduleModal';

const Operators = ({ token }: ProfileInfoProps) => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [operators, setOperators] = useState<{ [key: number]: Operator[] }>({});
  const [userTimes, setUserTimes] = useState<{ [key: number]: UserTime[] }>({});
  const [services, setServices] = useState<Service[]>([]);
  const [loadingClinics, setLoadingClinics] = useState<boolean>(true);
  const [loadingOperators, setLoadingOperators] = useState<{ [key: number]: boolean }>({});
  const [loadingTimes, setLoadingTimes] = useState<{ [key: number]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<number | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<{ clinicId: number; userId: number } | null>(null);
  const [isCancellationsModalOpen, setIsCancellationsModalOpen] = useState<{ clinicId: number; userId: number } | null>(null);
  const [expandedOperators, setExpandedOperators] = useState<{ [key: string]: boolean }>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState<{ clinicId: number; userId: number } | null>(null);

  const weekdays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    const loadClinics = async () => {
      const cachedClinics = getCachedClinics();
      if (cachedClinics) {
        setClinics(cachedClinics);
        setLoadingClinics(false);
      } else {
        await fetchClinicsData(token ?? '', setClinics, setError, setLoadingClinics);
      }
    };

    const loadServices = async () => {
      try {
        const response: ServicesResponse = await getServices();

        setServices(response.data);
      } catch (err) {
        setError('خطا در بارگذاری خدمات');
      }
    };

    loadClinics();
    loadServices();
  }, [token]);

  useEffect(() => {
    const loadOperatorsAndTimes = async () => {
      if (clinics.length === 0) return;
      const newLoadingOperators = { ...loadingOperators };
      const newLoadingTimes = { ...loadingTimes };
      const operatorsData: { [key: number]: Operator[] } = {};
      const timesData: { [key: number]: UserTime[] } = {};

      for (const clinic of clinics) {
        newLoadingOperators[clinic.id] = true;
        setLoadingOperators({ ...newLoadingOperators });

        const cachedOperators = getCachedOperators(clinic.id);
        if (cachedOperators) {
          operatorsData[clinic.id] = cachedOperators;
        } else {
          try {
            const response = await getOperators(clinic.id);
            operatorsData[clinic.id] = response.data;
            cacheOperators(clinic.id, response.data);
          } catch (err) {
            setError('خطا در بارگذاری اوپراتورها برای کلینیک ' + clinic.name);
          }
        }
        newLoadingOperators[clinic.id] = false;

        for (const operator of operatorsData[clinic.id] || []) {
          newLoadingTimes[operator.user_id] = true;
          setLoadingTimes({ ...newLoadingTimes });

          const cachedTimes = getCachedUserTimes(operator.user_id);
          if (cachedTimes) {
            timesData[operator.user_id] = cachedTimes;
          } else {
            try {
              const timesResponse = await getUserTimes(operator.user_id);
              timesData[operator.user_id] = timesResponse;
              cacheUserTimes(operator.user_id, timesResponse);
            } catch (err) {
              timesData[operator.user_id] = [];
            }
          }
          newLoadingTimes[operator.user_id] = false;
        }
      }

      setOperators(operatorsData);
      setUserTimes(timesData);
      setLoadingOperators({ ...newLoadingOperators });
      setLoadingTimes({ ...newLoadingTimes });
    };

    loadOperatorsAndTimes();
  }, [clinics]);

  const handleRefresh = async () => {
    setLoadingClinics(true);
    setError(null);
    localStorage.removeItem('clinics_cache');
    for (const clinic of clinics) {
      localStorage.removeItem(`operators_cache_${clinic.id}`);
      for (const operator of operators[clinic.id] || []) {
        localStorage.removeItem(`user_times_cache_${operator.user_id}`);
      }
    }
    await fetchClinicsData(token ?? '', setClinics, setError, setLoadingClinics);
  };

  const handleAddOperator = (clinicId: number) => {
    setIsCreateModalOpen(clinicId);
  };

  const handleOperatorCreate = async (response: CreateAndAssignOperatorResponse) => {
    const clinicId = response.data.clinic_id;
    setSuccessMessage(response.message);
    localStorage.removeItem(`operators_cache_${clinicId}`);
    const operatorsResponse = await getOperators(clinicId);
    setOperators((prev) => ({
      ...prev,
      [clinicId]: operatorsResponse.data,
    }));
    cacheOperators(clinicId, operatorsResponse.data);
  };

  const handleDetachOperator = async (clinicId: number, operatorId: number) => {
    const confirmed = window.confirm('آیا مطمئن هستید که می‌خواهید این اوپراتور را از کلینیک جدا کنید؟');
    if (!confirmed) return;

    try {
      const response = await detachOperator(clinicId, operatorId);
      localStorage.removeItem(`operators_cache_${clinicId}`);
      localStorage.removeItem(`user_times_cache_${operatorId}`);
      const operatorsResponse = await getOperators(clinicId);
      setOperators((prev) => ({
        ...prev,
        [clinicId]: operatorsResponse.data,
      }));
      cacheOperators(clinicId, operatorsResponse.data);
      setSuccessMessage(response.message);
    } catch (err) {
      setError('خطا در جدا کردن اوپراتور');
    }
  };

  const handleScheduleCreate = async (clinicId: number, userId: number) => {
    setSuccessMessage('زمان‌بندی با موفقیت ثبت شد');
    localStorage.removeItem(`user_times_cache_${userId}`);
    try {
      const timesResponse = await getUserTimes(userId);
      setUserTimes((prev) => ({
        ...prev,
        [userId]: timesResponse,
      }));
      cacheUserTimes(userId, timesResponse);
    } catch (err) {
      setError('خطا در بارگذاری زمان‌بندی‌های جدید');
    }
  };

  const handleCancellationChange = async (clinicId: number, userId: number) => {
    setSuccessMessage('کنسلی با موفقیت تغییر کرد');
    localStorage.removeItem(`user_times_cache_${userId}`);
    try {
      const timesResponse = await getUserTimes(userId);
      setUserTimes((prev) => ({
        ...prev,
        [userId]: timesResponse,
      }));
      cacheUserTimes(userId, timesResponse);
    } catch (err) {
      setError('خطا در به‌روزرسانی زمان‌بندی‌ها');
    }
  };

  const getServiceName = (serviceId: number) => {
    const service = services.find((s) => s.id === serviceId);
    return service ? service.title : 'نامشخص';
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  const getFilteredTimesByWeekday = (times: UserTime[], clinicId: number) => {
    const filteredTimes = times.filter((time) => time.clinic_id === clinicId);
    const timesByWeekday: { [key: string]: UserTime[] } = {};
    weekdays.forEach((day) => {
      timesByWeekday[day] = filteredTimes.filter((time) => time.weekday === day);
    });
    return timesByWeekday;
  };

  const getActiveWeekdays = (times: UserTime[], clinicId: number) => {
    const filteredTimes = times.filter((time) => time.clinic_id === clinicId);
    const activeDays = Array.from(new Set(filteredTimes.map((time) => time.weekday)));
    return weekdays.filter((day) => activeDays.includes(day));
  };

  const toggleAccordion = (clinicId: number, operatorId: number) => {
    const key = `${clinicId}-${operatorId}`;
    setExpandedOperators((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (loadingClinics) {
    return <div className="text-center">در حال بارگذاری کلینیک‌ها...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (clinics.length === 0) {
    return <div className="text-center">کلینیکی یافت نشد.</div>;
  }

  return (
    <div className="flex flex-col">
      <style>
        {`
          .details {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
          }
          .details.open {
            max-height: 500px;
            opacity: 1;
          }
        `}
      </style>

      {clinics.map((clinic) => (
        <div key={clinic.id} className="mb-6 border-r-2 pr-2 border-primary">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center">
              <HiOutlineBuildingOffice2 className="text-gray-500 text-xl" />
              <h3 className="text-sm mr-2">{clinic.name}</h3>
            </div>
            {/*
            <button
              className="text-primary flex gap-1 justify-center items-center"
              onClick={() => handleAddOperator(clinic.id)}
            >
              <HiOutlinePlusCircle className="text-xl" />افزودن
            </button>
             */}


          </div>
          <div className="mt-3">
            {loadingOperators[clinic.id] ? (
              <p className="text-gray-500">در حال بارگذاری اوپراتورها...</p>
            ) : operators[clinic.id]?.length > 0 ? (
              <ul className="space-y-2">
                {operators[clinic.id].map((operator) => {
                  const activeWeekdays = getActiveWeekdays(userTimes[operator.user_id] || [], clinic.id);
                  const hasTimes = activeWeekdays.length > 0;
                  const accordionKey = `${clinic.id}-${operator.user_id}`;
                  const isExpanded = expandedOperators[accordionKey];

                  return (
                    <li key={operator.user_id} className={`${isExpanded ? 'border-light' : ''} border p-2 rounded`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <HiUser className="bg-light p-2 text-4xl rounded-full text-primary" />
                          <div className='flex gap-5'>
                            <span className="font-medium">{operator.nickname}</span>
                            <div className='flex gap-2'>
                              <HiOutlineDevicePhoneMobile className="text-2xl  text-gray-400" />
                              <span className="text-gray-500">{operator.phone}</span>
                            </div>

                          </div>
                        </div>
                        <div className="flex gap-2">
                          {hasTimes ? (
                            <button
                              className="text-primary flex gap-1 p-2 text-xs justify-center items-center bg-blue-100 rounded-md"
                              onClick={() => toggleAccordion(clinic.id, operator.user_id)}
                            >
                              {isExpanded ? (
                                <HiChevronUp className="text-xl" />
                              ) : (
                                <HiOutlineCalendar className="text-xl" />
                              )}
                              نمایش زمان‌بندی
                            </button>
                          ) : (
                            <button
                              className="text-green-500 flex gap-1 p-2 text-xs justify-center items-center bg-green-100 rounded-md"
                              onClick={() => setIsScheduleModalOpen({ clinicId: clinic.id, userId: operator.user_id })}
                            >
                              <HiOutlinePlusCircle className="text-xl" />
                              افزودن زمان‌ بندی
                            </button>
                          )}
                          <button
                            className="text-orange-500 flex gap-1 p-2 text-xs justify-center items-center bg-orange-100 rounded-md"
                            onClick={() => setIsCancellationsModalOpen({ clinicId: clinic.id, userId: operator.user_id })}
                          >
                            <HiOutlineXMark className="text-xl" />
                            کنسلی‌ها
                          </button>
                          {/*
                            <button
                            className="text-red-500 hover:text-red-600 flex gap-1 p-2 text-xs justify-center items-center bg-red-100 rounded-md"
                            onClick={() => handleDetachOperator(clinic.id, operator.operator_id)}
                            title="حذف اوپراتور"
                          >
                            <HiOutlineTrash className="text-xl" />
                          </button>
                           */}



                        </div>
                      </div>
                      {loadingTimes[operator.user_id] ? (
                        <p className="text-gray-500 mt-2 text-center">در حال بارگذاری تایم‌ها...</p>
                      ) : isExpanded && hasTimes ? (
                        <div className={`details ${isExpanded ? 'open' : ''}`}>
                          <div className="mt-4 border-t pt-2">
                            <div className="overflow-x-auto">
                              <table className="min-w-full border-collapse border border-gray-200 mt-1 rounded-lg">
                                <thead className="bg-gray-100">
                                  <tr>
                                    {activeWeekdays.map((day) => (
                                      <th key={day} className="border border-gray-200 px-4 py-2 text-sm text-center rounded-t-lg">
                                        {day === 'Saturday' ? 'شنبه' :
                                          day === 'Sunday' ? 'یک‌شنبه' :
                                            day === 'Monday' ? 'دوشنبه' :
                                              day === 'Tuesday' ? 'سه‌شنبه' :
                                                day === 'Wednesday' ? 'چهارشنبه' :
                                                  day === 'Thursday' ? 'پنج‌شنبه' : 'جمعه'}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {activeWeekdays.map((day) => {
                                    const timesByWeekday = getFilteredTimesByWeekday(userTimes[operator.user_id] || [], clinic.id);
                                    const dayTimes = timesByWeekday[day];
                                    return (
                                      <td key={day} className="border border-gray-200 px-4 py-2 text-sm text-start align-top">
                                        {dayTimes.length > 0 ? (
                                          <ul className="space-y-2">
                                            {dayTimes.map((time) => (
                                              <li key={time.id} className="bg-gray-50 p-2 rounded-md">
                                                <div className="flex items-center justify-start gap-2 mb-1">
                                                  <HiOutlineClock className="text-gray-500" />
                                                  <span className="font-medium">
                                                    {formatTime(time.start_date)} تا {formatTime(time.end_date)}
                                                  </span>
                                                </div>
                                                <ul className="space-y-1">
                                                  {time.services.map((serviceId) => (
                                                    <li key={serviceId} className="text-sm text-gray-700">
                                                      - {getServiceName(serviceId)}
                                                    </li>
                                                  ))}
                                                </ul>
                                              </li>
                                            ))}
                                          </ul>
                                        ) : (
                                          <span className="text-gray-500">-</span>
                                        )}
                                      </td>
                                    );
                                  })}
                                </tbody>
                              </table>
                              {/* Edit Schedule Button
                                <div className="mt-2 flex justify-center">
                                  <button
                                    className="text-primary flex gap-1 p-2 text-xs w-full justify-center items-center bg-light rounded-md"
                                    onClick={() => setIsEditModalOpen({ clinicId: clinic.id, userId: operator.user_id })}
                                  >
                                    <HiOutlinePlusCircle className="text-xl" />
                                    ویرایش زمان‌بندی
                                  </button>
                                </div>
                              */}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-2 border rounded flex justify-center items-center bg-gray-100 text-gray-500">
                بدون اوپراتور
              </div>
            )}
          </div>
          {isCreateModalOpen === clinic.id && (
            <CreateOperatorModal
              clinicId={clinic.id}
              isOpen={true}
              onClose={() => setIsCreateModalOpen(null)}
              onOperatorCreate={handleOperatorCreate}
              token={token ?? ''}
            />
          )}
        </div>
      ))}
      {isScheduleModalOpen && (
        <AddScheduleModal
          userId={isScheduleModalOpen.userId}
          clinicId={isScheduleModalOpen.clinicId}
          isOpen={true}
          onClose={() => setIsScheduleModalOpen(null)}
          onScheduleCreate={handleScheduleCreate}
        />
      )}
      {isCancellationsModalOpen && (
        <CancellationsModal
          userId={isCancellationsModalOpen.userId}
          clinicId={isCancellationsModalOpen.clinicId}
          isOpen={true}
          onClose={() => setIsCancellationsModalOpen(null)}
          onCancellationChange={() => handleCancellationChange(isCancellationsModalOpen.clinicId, isCancellationsModalOpen.userId,)}
        />
      )}
      {isEditModalOpen && (
        <EditScheduleModal
          userId={isEditModalOpen.userId}
          clinicId={isEditModalOpen.clinicId}
          isOpen={true}
          onClose={() => setIsEditModalOpen(null)}
          onScheduleUpdate={handleScheduleCreate}
          currentSchedules={userTimes[isEditModalOpen.userId] || []}
        />
      )}
      {successMessage && (
        <SuccessPopup
          key="success-popup"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </div>

  );
};

export default Operators;
