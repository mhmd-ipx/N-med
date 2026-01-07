import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { getDoctorById, getSpecialties, getDoctorReviews } from '../services/publicApi';
import type { Doctor, DoctorResponse, Specialty, Review } from '../services/publicApi';
import DoctorProfile from '../components/doctor/DoctorProfile';
import ClinicServices from '../components/doctor/ClinicServices';
import DoctorReviews from '../components/doctor/DoctorReviews';
import DoctorSidebar from '../components/doctor/DoctorSidebar';

const DoctorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctorStats, setDoctorStats] = useState<{ averageRating: number; reviewCount: number } | null>(null);
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
        const doctorId = parseInt(id);

        // Fetch doctor data, specialties, and reviews in parallel
        const [doctorResponse, specialtiesResponse, reviewsResponse] = await Promise.all([
          getDoctorById(doctorId),
          getSpecialties(),
          getDoctorReviews(doctorId)
        ]);

        if (doctorResponse && doctorResponse.data) {
          let doctorData = doctorResponse.data;

          // Map specialty IDs to titles
          if (doctorData.specialties && specialtiesResponse) {
            const specialtyTitles: string[] = [];

            // Handle different formats of specialties (could be string, array of strings, or array of numbers)
            let specialtyIds: number[] = [];
            if (typeof doctorData.specialties === 'string') {
              // If it's a comma-separated string, split it
              const ids = doctorData.specialties.split(',').map((s: string) => s.trim());
              specialtyIds = ids.map((id: string) => parseInt(id)).filter((id: number) => !isNaN(id));
            } else if (Array.isArray(doctorData.specialties)) {
              // If it's already an array
              specialtyIds = (doctorData.specialties as any[]).map((id: any) => typeof id === 'string' ? parseInt(id) : id).filter((id: number) => !isNaN(id));
            }

            // Map IDs to titles
            specialtyIds.forEach((id: number) => {
              const specialty = specialtiesResponse.find((s: Specialty) => s.id === id);
              if (specialty) {
                specialtyTitles.push(specialty.title);
              }
            });

            // Update doctor data with specialty titles as comma-separated string
            doctorData = {
              ...doctorData,
              specialties: specialtyTitles.length > 0 ? specialtyTitles.join(', ') : null
            };
          }

          // Calculate doctor stats from reviews
          const reviewsData = reviewsResponse.data || [];
          const reviewCount = reviewsData.length;
          const averageRating = reviewCount > 0
            ? reviewsData.reduce((sum, review) => sum + parseFloat(review.rating), 0) / reviewCount
            : 0;

          setDoctor(doctorData);
          setReviews(reviewsData);
          setSpecialties(specialtiesResponse);
          setDoctorStats({ averageRating, reviewCount });
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
        <div className="text-center ">
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
      <Helmet>
        <title>{doctor.user.name} | نیلو درمان</title>
      </Helmet>
      {/* Header */}
      <div className="bg-white shadow-sm ">
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
        <div className="space-y-8">
          <DoctorProfile doctor={doctor} stats={doctorStats} />
          <ClinicServices clinics={doctor.clinics} />
          <DoctorSidebar doctor={doctor} />
          <DoctorReviews doctorId={doctor.id} />
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;