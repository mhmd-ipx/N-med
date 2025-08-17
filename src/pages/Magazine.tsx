import { Helmet } from 'react-helmet-async';

function Magazine() {
  return (
    <div className='w-full justify-center items-center flex'>
      <Helmet>
        <title>مجله</title>
      </Helmet>
      <div className='w-full'>
        {/* Magazine Hero Section */}
        <section className='bg-gray-100 py-16'>
          <div className='container mx-auto px-4 text-center'>
            <h1 className='text-4xl font-bold mb-4'>مجله سلامت و تندرستی</h1>
            <p className='text-lg text-gray-600'>
              جدیدترین مقالات و تست‌های سلامت را در مجله ما بخوانید و کشف کنید.
            </p>
          </div>
        </section>

        {/* Articles Section */}
        <section className='py-16'>
          <div className='container mx-auto px-4'>
            <h2 className='text-2xl font-semibold mb-6'>مقالات برجسته</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {/* Article 1 */}
              <div className='bg-white shadow-md rounded-md overflow-hidden'>
                <img
                  src='https://www.iranhormone.ir/wp-content/uploads/2020/08/Article-Img02.jpg'
                  alt='مقاله ۱'
                  className='w-full h-48 object-cover'
                />
                <div className='p-4'>
                  <h3 className='text-xl font-semibold mb-2'>چگونه خواب بهتری داشته باشیم</h3>
                  <p className='text-gray-600 mb-4'>
                    نکات و ترفندهایی برای بهبود کیفیت خواب و افزایش انرژی روزانه.
                  </p>
                  <a
                    href='#'
                    className='text-blue-600 hover:underline'
                  >
                    ادامه مطلب
                  </a>
                </div>
              </div>
              {/* Article 2 */}
              <div className='bg-white shadow-md rounded-md overflow-hidden'>
                <img
                  src='https://www.iranhormone.ir/wp-content/uploads/2020/08/Article-Img02.jpg'
                  alt='مقاله ۲'
                  className='w-full h-48 object-cover'
                />
                <div className='p-4'>
                  <h3 className='text-xl font-semibold mb-2'>تغذیه سالم برای قلب</h3>
                  <p className='text-gray-600 mb-4'>
                    غذاهایی که به سلامت قلب شما کمک می‌کنند و رژیم‌های پیشنهادی.
                  </p>
                  <a
                    href='#'
                    className='text-blue-600 hover:underline'
                  >
                    ادامه مطلب
                  </a>
                </div>
              </div>
              {/* Article 3 */}
              <div className='bg-white shadow-md rounded-md overflow-hidden'>
                <img
                  src='https://www.iranhormone.ir/wp-content/uploads/2020/08/Article-Img02.jpg'
                  alt='مقاله ۳'
                  className='w-full h-48 object-cover'
                />
                <div className='p-4'>
                  <h3 className='text-xl font-semibold mb-2'>مدیتیشن و کاهش استرس</h3>
                  <p className='text-gray-600 mb-4'>
                    تکنیک‌های ساده مدیتیشن برای آرامش ذهن و کاهش استرس.
                  </p>
                  <a
                    href='#'
                    className='text-blue-600 hover:underline'
                  >
                    ادامه مطلب
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Test Categories Section */}
        <section className='py-16 bg-gray-100'>
          <div className='container mx-auto px-4'>
            <h2 className='text-2xl font-semibold mb-6 text-center'>دسته‌بندی‌های تست سلامت</h2>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
              {/* Test Category 1 */}
              <div className='bg-white shadow-md rounded-md p-4 text-center'>
                <h3 className='text-lg font-semibold mb-2'>تست سلامت روان</h3>
                <p className='text-gray-600 mb-4'>
                  میزان استرس و سلامت روان خود را با این تست بررسی کنید.
                </p>
                <button
                  className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300'
                  onClick={() => alert('تست شروع شد!')}
                >
                  شروع تست
                </button>
              </div>
              {/* Test Category 2 */}
              <div className='bg-white shadow-md rounded-md p-4 text-center'>
                <h3 className='text-lg font-semibold mb-2'>تست سلامت قلب</h3>
                <p className='text-gray-600 mb-4'>
                  سلامت قلب خود را با چند سوال ساده ارزیابی کنید.
                </p>
                <button
                  className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300'
                  onClick={() => alert('تست شروع شد!')}
                >
                  شروع تست
                </button>
              </div>
              {/* Test Category 3 */}
              <div className='bg-white shadow-md rounded-md p-4 text-center'>
                <h3 className='text-lg font-semibold mb-2'>تست خواب</h3>
                <p className='text-gray-600 mb-4'>
                  کیفیت خواب خود را با این تست بررسی کنید.
                </p>
                <button
                  className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300'
                  onClick={() => alert('تست شروع شد!')}
                >
                  شروع تست
                </button>
              </div>
              {/* Test Category 4 */}
              <div className='bg-white shadow-md rounded-md p-4 text-center'>
                <h3 className='text-lg font-semibold mb-2'>تست تغذیه</h3>
                <p className='text-gray-600 mb-4'>
                  رژیم غذایی خود را با این تست ارزیابی کنید.
                </p>
                <button
                  className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300'
                  onClick={() => alert('تست شروع شد!')}
                >
                  شروع تست
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Magazine;