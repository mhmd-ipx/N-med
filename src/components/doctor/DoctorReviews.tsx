import { HiOutlineStar } from 'react-icons/hi2';

const DoctorReviews = () => {
  // Mock reviews data - in a real app, this would come from an API
  const reviews = [
    {
      id: 1,
      name: 'بیمار ۱',
      rating: 5,
      comment: 'تجربه بسیار خوبی داشتم. دکتر بسیار حرفه‌ای و خوش برخورد بودند.',
      date: '۱۴۰۳/۰۸/۱۵'
    },
    {
      id: 2,
      name: 'بیمار ۲',
      rating: 5,
      comment: 'زمان انتظار مناسب و خدمات با کیفیت بالا.',
      date: '۱۴۰۳/۰۸/۱۰'
    },
    {
      id: 3,
      name: 'بیمار ۳',
      rating: 4,
      comment: 'دکتر بسیار باتجربه و صبور بودند. ممنون از خدمات.',
      date: '۱۴۰۳/۰۸/۰۵'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right">نظرات بیماران</h2>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">{review.name.split(' ')[1]}</span>
              </div>
              <div className="flex-1 text-right">
                <h4 className="font-medium text-gray-900">{review.name}</h4>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <HiOutlineStar
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-xs text-gray-500">{review.date}</span>
            </div>
            <p className="text-gray-600 text-right leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorReviews;