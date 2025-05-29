import { useState, useEffect } from 'react';
import { fetchClinicsData, getCachedClinics, getCachedOperators, cacheOperators } from '../Clinices/ClinicDataManager.ts';
import { getOperators, detachOperator } from '../../../../../services/serverapi.ts';
import type { Clinic, ProfileInfoProps, Operator, CreateAndAssignOperatorResponse } from '../../../../../types/types.ts';
import { HiOutlineBuildingOffice2, HiOutlineTrash , HiUser , HiOutlinePlusCircle } from 'react-icons/hi2';
import SuccessPopup from '../../../../../components/ui/SuccessPopup.tsx';
import CreateOperatorModal from './CreateOperatorModal.tsx';

const Operators = ({ token }: ProfileInfoProps) => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [operators, setOperators] = useState<{ [key: number]: Operator[] }>({});
  const [loadingClinics, setLoadingClinics] = useState<boolean>(true);
  const [loadingOperators, setLoadingOperators] = useState<{ [key: number]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<number | null>(null);

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

    loadClinics();
  }, [token]);

  useEffect(() => {
    const loadOperators = async () => {
      if (clinics.length === 0) return;
      const newLoadingOperators = { ...loadingOperators };
      const operatorsData: { [key: number]: Operator[] } = {};

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
      }

      setOperators(operatorsData);
      setLoadingOperators({ ...newLoadingOperators });
    };

    loadOperators();
  }, [clinics]);

  const handleRefresh = async () => {
    setLoadingClinics(true);
    setError(null);
    localStorage.removeItem('clinics_cache');
    for (const clinic of clinics) {
      localStorage.removeItem(`operators_cache_${clinic.id}`);
    }
    await fetchClinicsData(token ?? '', setClinics, setError, setLoadingClinics);
  };

  const handleAddOperator = (clinicId: number) => {
    setIsCreateModalOpen(clinicId);
  };

  const handleOperatorCreate = async (response: CreateAndAssignOperatorResponse) => {
    const clinicId = response.data.clinic_id;
    setSuccessMessage(response.message);
    // رفرش کش اوپراتورها برای کلینیک مربوطه
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
      // رفرش کش اوپراتورها برای کلینیک مربوطه
      localStorage.removeItem(`operators_cache_${clinicId}`);
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
      {/*<div className="flex justify-between items-center mb-4">
        <span>لیست کلینیک‌ها و اوپراتورها</span>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
          onClick={handleRefresh}
          disabled={loadingClinics}
        >
          <HiOutlineFire className="text-xl" />
          به‌روزرسانی
        </button>
      </div>*/}
      {clinics.map((clinic) => (
        <div key={clinic.id} className="mb-6 border-r-2 pr-2 border-primary">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center">
              <HiOutlineBuildingOffice2 className="text-gray-500 text-xl" />
              <h3 className="text-sm mr-2">{clinic.name}</h3>
            </div>
            <button
              className=" text-primary flex gap-1 justify-center items-center"
              onClick={() => handleAddOperator(clinic.id)}
            >
              <HiOutlinePlusCircle className='text-xl'/>افزودن
            </button>
          </div>
          <div className="mt-3">
            {loadingOperators[clinic.id] ? (
              <p className="text-gray-500">در حال بارگذاری اوپراتورها...</p>
            ) : operators[clinic.id]?.length > 0 ? (
              <ul className="space-y-2">
                {operators[clinic.id].map((operator) => (
                  <li key={operator.operator_id} className="flex items-center justify-between  border p-2 rounded gap-2">
                    <div className="flex items-center gap-2">
                      <HiUser className='bg-light p-2 text-4xl rounded-full text-primary' />
                      <span className="font-medium">{operator.nickname}</span>
                      <span className="text-gray-500">({operator.phone})</span>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-600 flex gap-1 p-2 text-xs justify-center items-center bg-red-100 rounded-md"
                      onClick={() => handleDetachOperator(clinic.id, operator.operator_id)}
                      title="حذف اوپراتور"
                    >
                      <HiOutlineTrash className="text-xl" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className='p-2 border rounded flex justify-center items-center bg-gray-100 text-gray-500'>بدون اوپراتور</div>

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