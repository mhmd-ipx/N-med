import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Helmet>
        <title>404 - صفحه یافت نشد | نیلو درمان</title>
      </Helmet>
      <div className="max-w-md w-full text-center">
        {/* 404 Image */}
        <div className="mb-8">
          <img
            src="/src/assets/images/404.jpg"
            alt="صفحه یافت نشد"
            className="w-full max-w-sm mx-auto rounded-full shadow-lg"
          />
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">۴۰۴</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            صفحه مورد نظر یافت نشد
          </h2>
          <p className="text-gray-600 mb-6">
            متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            بازگشت به صفحه اصلی
          </Link>

          <div className="text-sm text-gray-500">
            یا به یکی از صفحات زیر بروید:
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/doctors"
              className="text-primary hover:text-primary-dark font-medium transition-colors duration-200"
            >
              لیست پزشکان
            </Link>
            <span className="hidden sm:inline text-gray-400">|</span>
            <Link
              to="/categories"
              className="text-primary hover:text-primary-dark font-medium transition-colors duration-200"
            >
              دسته‌بندی خدمات
            </Link>
            <span className="hidden sm:inline text-gray-400">|</span>
            <Link
              to="/contact"
              className="text-primary hover:text-primary-dark font-medium transition-colors duration-200"
            >
              تماس با ما
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;