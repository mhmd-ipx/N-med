import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { getDoctorById } from '../services/publicApi';
import type { Doctor, DoctorResponse } from '../services/publicApi';
import DoctorProfile from '../components/doctor/DoctorProfile';
import ClinicServices from '../components/doctor/ClinicServices';
import DoctorReviews from '../components/doctor/DoctorReviews';
import DoctorSidebar from '../components/doctor/DoctorSidebar';

const DoctorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) {
        setError('شناسه دکتر نامعتبر است');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // console.log('Fetching doctor with ID:', id);
        const doctorId = parseInt(id);

        // Get individual doctor data
        const response: DoctorResponse = await getDoctorById(doctorId);
        // console.log('Doctor data received:', response);

        // The API returns { data: Doctor } structure
        if (response && response.data) {
          setDoctor(response.data);
          setError(null);
        } else {
          throw new Error('پاسخ API نامعتبر است');
        }
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setError(err instanceof Error ? err.message : 'دکتر مورد نظر یافت نشد');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-red-600">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">خطا در بارگذاری</h2>
          <p className="text-gray-600 mb-4">{error || 'دکتر مورد نظر یافت نشد'}</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <DoctorProfile doctor={doctor} />
            <ClinicServices clinics={doctor.clinics} />
            <DoctorReviews />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <DoctorSidebar doctor={doctor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;