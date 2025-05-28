import { useState, useEffect, Fragment } from 'react';
import type { ProfileInfoProps, Clinic } from '../../../../../types/types.ts';
import { fetchClinicsData, getCachedClinics } from './ClinicDataManager.ts';
import Accordion from '../../../../../components/ui/Accordion/Accordion.tsx';
import { HiOutlineMapPin, HiOutlinePhone, HiOutlineDocumentText, HiOutlineFire } from 'react-icons/hi2';
import MapComponent from '../../../../../components/ui/MapComponent/MapComponent.tsx';
import EditClinicModal from './EditClinicModal.tsx';
import CreateClinicModal from './CreateClinicModal.tsx';
import SuccessPopup from '../../../../../components/ui/SuccessPopup.tsx';
import { DeleteClinic } from '../../../../../services/serverapi.ts';

const Clinics = ({ token }: ProfileInfoProps) => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openClinicId, setOpenClinicId] = useState<number | null>(null);
  const [editClinic, setEditClinic] = useState<Clinic | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadClinics = async () => {
    const cachedClinics = getCachedClinics();
    if (cachedClinics) {
      setClinics(cachedClinics);
      setError(null);
      setIsLoading(false);
    } else {
      await fetchClinicsData(token ?? '', setClinics, setError, setIsLoading);
    }
  };

  const handleRefreshClinics = async () => {
    setIsLoading(true);
    setError(null);
    localStorage.removeItem('clinics_cache');
    await fetchClinicsData(token ?? '', setClinics, setError, setIsLoading);
  };

  const handleClinicUpdate = (updatedClinic: Clinic) => {
    setClinics((prevClinics) =>
      prevClinics.map((clinic) =>
        clinic.id === updatedClinic.id ? updatedClinic : clinic
      )
    );
    setSuccessMessage('کلینیک با موفقیت به‌روزرسانی شد');
    const cachedClinics = JSON.parse(localStorage.getItem('clinics_cache') || '{}').clinics || [];
    const updatedClinics = cachedClinics.map((clinic: Clinic) =>
      clinic.id === updatedClinic.id ? updatedClinic : clinic
    );
    localStorage.setItem('clinics_cache', JSON.stringify({
      clinics: updatedClinics,
      timestamp: Date.now(),
    }));
  };

  const handleClinicCreate = async (newClinic: Clinic) => {
    setClinics((prevClinics) => [...prevClinics, newClinic]);
    setSuccessMessage('کلینیک با موفقیت ایجاد شد');
    setIsLoading(true);
    setError(null);
    localStorage.removeItem('clinics_cache');
    await fetchClinicsData(token ?? '', setClinics, setError, setIsLoading);
  };

  const handleClinicDelete = async (clinicId: number) => {
    const confirmed = window.confirm('آیا مطمئن هستید که می‌خواهید این کلینیک را حذف کنید؟');
    if (!confirmed) return;

    try {
      const response = await DeleteClinic(clinicId, token ?? '');
      setClinics((prevClinics) => prevClinics.filter((clinic) => clinic.id !== clinicId));
      setIsLoading(true);
      setError(null);
      localStorage.removeItem('clinics_cache');
      await fetchClinicsData(token ?? '', setClinics, setError, setIsLoading);
      setSuccessMessage(response.message);
    } catch (err) {
      console.error('Delete error:', err);
      setError('خطا در حذف کلینیک');
    }
  };

  useEffect(() => {
    loadClinics();
  }, [token]);

  const toggleClinic = (id: number) => {
    setOpenClinicId(openClinicId === id ? null : id);
  };

  const parseGeo = (geo: string): { lat: number; lng: number } | null => {
    try {
      const [lat, lng] = geo.split(',').map((coord) => parseFloat(coord.trim()));
      if (isNaN(lat) || isNaN(lng)) {
        throw new Error('مقادیر lat یا lng معتبر نیستند');
      }
      return { lat, lng };
    } catch {
      return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span>آدرس مطب / مطب‌ها:</span>
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setIsCreateModalOpen(true)}
          >
            ایجاد کلینیک
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
            onClick={handleRefreshClinics}
            disabled={isLoading}
          >
            <HiOutlineFire className="text-xl" />
            به‌روزرسانی
          </button>
        </div>
      </div>
      <Fragment>
        {isLoading && <p key="loading">در حال بارگذاری...</p>}
        {error && <p className="text-red-500" key="error">{error}</p>}
        {!isLoading && !error && clinics.length === 0 && <p key="no-clinics">کلینیکی یافت نشد.</p>}
        {!isLoading &&
          !error &&
          clinics.map((clinic) => {
            const geoData = parseGeo(clinic.geo);
            return (
              <div className="mb-2 mt-2" key={clinic.id}>
                <Accordion
                  id={clinic.id}
                  isOpen={openClinicId === clinic.id}
                  onToggle={() => toggleClinic(clinic.id)}
                  title={
                    <div className="flex justify-center items-center">
                      <HiOutlineMapPin className="text-primary text-xl" />
                      <h3 className="text-sm font-semibold ml-4 mr-2">{clinic.name}</h3>
                      <p>{`${clinic.province?.faname}، ${clinic.city?.faname}`}</p>
                    </div>
                  }
                  content={
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-3">
                        <p className="flex items-center gap-2">
                          <HiOutlineDocumentText className="text-primary text-xl" />
                          {clinic.address || 'آدرس مشخص نشده است.'}
                        </p>

                        <p className="flex items-center gap-2">
                          <HiOutlineDocumentText className="text-primary text-xl" />
                          {clinic.description || 'توضیحی برای این کلینیک وجود ندارد.'}
                        </p>


                        <p className="flex items-center gap-2">
                          <HiOutlinePhone className="text-primary text-xl" />
                          {clinic.phone}
                        </p>
                        <div className="flex gap-2">
                          <button
                            className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
                            onClick={() => setEditClinic(clinic)}
                          >
                            ویرایش
                          </button>
                          <button
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                            onClick={() => handleClinicDelete(clinic.id)}
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 h-[200px] max-h-[200px] rounded-lg overflow-hidden">
                        {geoData ? (
                          <MapComponent lat={geoData.lat} lng={geoData.lng} name={clinic.name} />
                        ) : (
                          <p className="text-red-500">موقعیت جغرافیایی نامعتبر است</p>
                        )}
                      </div>
                    </div>
                  }
                />
                {editClinic && editClinic.id === clinic.id && (
                  <EditClinicModal
                    clinic={clinic}
                    isOpen={true}
                    onClose={() => setEditClinic(null)}
                    onClinicUpdate={handleClinicUpdate}
                    token={token ?? ''}
                  />
                )}
              </div>
            );
          })}
        {isCreateModalOpen && (
          <CreateClinicModal
            key="create-modal"
            isOpen={true}
            onClose={() => setIsCreateModalOpen(false)}
            onClinicCreate={handleClinicCreate}
            token={token ?? ''}
          />
        )}
        {successMessage && (
          <SuccessPopup
            key="success-popup"
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
          />
        )}
      </Fragment>
    </div>
  );
};

export default Clinics;