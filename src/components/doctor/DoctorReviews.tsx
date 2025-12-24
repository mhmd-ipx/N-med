import { useEffect, useState } from 'react';
import { HiOutlineStar } from 'react-icons/hi2';
import { getDoctorReviews } from '../../services/publicApi';
import { postDoctorReview } from '../../services/serverapi';
import { useUser } from '../../components/ui/login/UserLoginProvider';
import LoginForm from '../../components/ui/login/Loginform';
import type { Review } from '../../services/publicApi';

interface DoctorReviewsProps {
  doctorId: number;
}

const DoctorReviews = ({ doctorId }: DoctorReviewsProps) => {
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await getDoctorReviews(doctorId);
        setReviews(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(err instanceof Error ? err.message : 'خطا در بارگذاری نظرات');
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchReviews();
    }
  }, [doctorId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      alert('لطفاً متن نظر خود را وارد کنید');
      return;
    }

    setSubmittingReview(true);
    try {
      await postDoctorReview(doctorId, {
        review_text: reviewText.trim(),
        rating: rating
      });

      // Refresh reviews
      const response = await getDoctorReviews(doctorId);
      setReviews(response.data);

      // Reset form
      setReviewText('');
      setRating(5);
      setShowReviewForm(false);
      alert('نظر شما با موفقیت ثبت شد');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('خطا در ثبت نظر. لطفاً دوباره تلاش کنید');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right">نظرات بیماران</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right">نظرات بیماران</h2>
        <div className="text-center py-8">
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Check if user is logged in as patient
  const authData = localStorage.getItem('authData');
  let isLoggedIn = false;
  if (authData) {
    try {
      const parsedData = JSON.parse(authData);
      if (parsedData?.token && parsedData?.user?.id && parsedData?.user?.role === 'patient') {
        isLoggedIn = true;
      }
    } catch (error) {
      console.error('Error parsing authData from localStorage:', error);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right">نظرات بیماران</h2>

        {/* Login Form for Reviews */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-red-600 mb-3 text-right">نیاز به ورود</h3>
          <p className="text-gray-600 mb-4 text-right">
            برای ثبت نظر، لطفاً ابتدا وارد حساب کاربری خود شوید.
          </p>
          <LoginForm role="patient" redirectPath={`/doctor/${doctorId}`} />
        </div>

        {/* Display existing reviews */}
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">هنوز نظری ثبت نشده است.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">{review.user.name.split(' ')[0]}</span>
                  </div>
                  <div className="flex-1 text-right">
                    <h4 className="font-medium text-gray-900">{review.user.name}</h4>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <HiOutlineStar
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(parseFloat(review.rating)) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(review.created_at)}</span>
                </div>
                <p className="text-gray-600 text-right leading-relaxed">
                  {review.review_text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showReviewForm ? 'لغو' : 'افزودن نظر'}
        </button>
        <h2 className="text-2xl font-bold text-gray-900">نظرات بیماران</h2>
      </div>

      {/* Add Review Form */}
      {showReviewForm && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-right">ثبت نظر جدید</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2 text-right">امتیاز</label>
              <div className="flex gap-1 justify-end">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-2xl focus:outline-none"
                  >
                    <HiOutlineStar
                      className={`${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2 text-right">متن نظر</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-right"
                rows={4}
                placeholder="نظر خود را اینجا بنویسید..."
                required
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                لغو
              </button>
              <button
                type="submit"
                disabled={submittingReview}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReview ? 'در حال ثبت...' : 'ثبت نظر'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Display Reviews */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">هنوز نظری ثبت نشده است.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">{review.user.name.split(' ')[0]}</span>
                </div>
                <div className="flex-1 text-right">
                  <h4 className="font-medium text-gray-900">{review.user.name}</h4>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <HiOutlineStar
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(parseFloat(review.rating)) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-500">{formatDate(review.created_at)}</span>
              </div>
              <p className="text-gray-600 text-right leading-relaxed">
                {review.review_text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorReviews;