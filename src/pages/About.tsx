import { Helmet } from 'react-helmet-async';

function About() {
  return (
    <div className='w-full '>

      <Helmet>
        <title>درباره ما - نیلودرمان</title>
        <meta name="description" content="نیلودرمان پلتفرم نوبت‌دهی آنلاین پزشکی با بهترین پزشکان و خدمات درمانی در ایران" />
      </Helmet>

      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-primary via-blue-600 to-blue-800 py-20 md:py-32 overflow-hidden'>
        <div className="absolute inset-0 bg-[url('/n-med-logo.png')] bg-no-repeat bg-center opacity-5 bg-contain"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-blue-800/90"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        <div className='relative max-w-[1300px] container mx-auto px-4 text-center text-white'>
          <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 mb-6">
            <img
              src='/n-med-logo.png'
              alt='نیلودرمان'
              className='w-16 h-16 mx-auto'
            />
          </div>
          <h1 className='text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent'>
            درباره نیلودرمان
          </h1>
          <p className='text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8'>
            پلتفرم نوبت‌دهی آنلاین پزشکی با بهترین پزشکان و خدمات درمانی در ایران
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">✅ بیش از ۱۰۰۰ پزشک متخصص</span>
            <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">✅ رزرو آنلاین ۲۴ ساعته</span>
            <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">✅ پشتیبانی تخصصی</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-16 bg-white'>
        <div className='container max-w-[1300px] mx-auto px-0'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            <div className='text-center group'>
              <div className='w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg'>
                <span className='text-2xl font-bold text-white'>۱۰۰۰+</span>
              </div>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>پزشک متخصص</h3>
              <p className='text-sm text-gray-600'>در سراسر کشور</p>
            </div>
            <div className='text-center group'>
              <div className='w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg'>
                <span className='text-2xl font-bold text-white'>۵۰ هزار+</span>
              </div>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>نوبت رزرو شده</h3>
              <p className='text-sm text-gray-600'>ماهانه</p>
            </div>
            <div className='text-center group'>
              <div className='w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg'>
                <span className='text-2xl font-bold text-white'>۹۸%</span>
              </div>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>رضایت بیماران</h3>
              <p className='text-sm text-gray-600'>بر اساس نظرات</p>
            </div>
            <div className='text-center group'>
              <div className='w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg'>
                <span className='text-2xl font-bold text-white'>۲۴/۷</span>
              </div>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>پشتیبانی</h3>
              <p className='text-sm text-gray-600'>در تمام ساعات</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className='py-20 bg-gradient-to-br from-gray-50 to-blue-50'>
        <div className='container mx-auto max-w-[1300px] px-4'>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-6'>داستان ما</h2>
              <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                نیلودرمان با هدف حل مشکلات دسترسی به خدمات پزشکی در ایران متولد شد
              </p>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              <div className='space-y-6'>
                <div className='bg-white p-8 rounded-2xl shadow-lg border border-gray-100'>
                  <h3 className='text-2xl font-bold text-gray-800 mb-4'>چالش‌های موجود</h3>
                  <ul className='space-y-3 text-gray-700'>
                    <li className='flex items-start gap-3'>
                      <span className='w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0'></span>
                      <span>صف‌های طولانی در مطب پزشکان</span>
                    </li>
                    <li className='flex items-start gap-3'>
                      <span className='w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0'></span>
                      <span>مشکل دسترسی به پزشکان متخصص</span>
                    </li>
                    <li className='flex items-start gap-3'>
                      <span className='w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0'></span>
                      <span>هدر رفت زمان بیماران و پزشکان</span>
                    </li>
                  </ul>
                </div>
                <div className='bg-white p-8 rounded-2xl shadow-lg border border-gray-100'>
                  <h3 className='text-2xl font-bold text-gray-800 mb-4'>راه حل نیلودرمان</h3>
                  <ul className='space-y-3 text-gray-700'>
                    <li className='flex items-start gap-3'>
                      <span className='w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0'></span>
                      <span>رزرو آنلاین نوبت در کمترین زمان</span>
                    </li>
                    <li className='flex items-start gap-3'>
                      <span className='w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0'></span>
                      <span>دسترسی به پزشکان سراسر کشور</span>
                    </li>
                    <li className='flex items-start gap-3'>
                      <span className='w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0'></span>
                      <span>مدیریت هوشمند وقت‌ها</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className='relative'>
                <div className='bg-gradient-to-br from-primary to-blue-600 p-8 rounded-2xl text-white shadow-2xl'>
                  <h3 className='text-2xl font-bold mb-6'>چرا نیلودرمان؟</h3>
                  <div className='space-y-4'>
                    <p className='leading-relaxed'>
                      نیلودرمان پلتفرمی است که دسترسی به خدمات پزشکی را برای همه آسان کرده است.
                      با استفاده از نیلودرمان می‌توانید به راحتی پزشک مورد نظر خود را پیدا کنید و نوبت خود را رزرو کنید.
                    </p>
                    <p className='leading-relaxed'>
                      ما با همکاری بهترین پزشکان و متخصصان حوزه سلامت، خدماتی با کیفیت بالا ارائه می‌دهیم
                      تا تجربه‌ای بی‌نظیر از دریافت خدمات پزشکی داشته باشید.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto px-4 max-w-[1300px]'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-6'>ویژگی‌های منحصر به فرد نیلودرمان</h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              تجربه‌ای نوین از نوبت‌گیری پزشکی با تکنولوژی‌های پیشرفته
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <div className='group bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2'>
              <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                <span className='text-2xl text-white'>🩺</span>
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-4'>پزشکان متخصص</h3>
              <p className='text-gray-600 leading-relaxed'>
                دسترسی به بهترین پزشکان متخصص در تمام رشته‌های پزشکی در سراسر کشور با امکان مشاهده رزومه و نظرات بیماران
              </p>
            </div>

            <div className='group bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2'>
              <div className='w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                <span className='text-2xl text-white'>📱</span>
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-4'>رزرو آنلاین</h3>
              <p className='text-gray-600 leading-relaxed'>
                رزرو نوبت به صورت آنلاین و در کمترین زمان ممکن با امکان انتخاب تاریخ و ساعت دلخواه
              </p>
            </div>

            <div className='group bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2'>
              <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                <span className='text-2xl text-white'>💬</span>
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-4'>پشتیبانی ۲۴ ساعته</h3>
              <p className='text-gray-600 leading-relaxed'>
                تیم پشتیبانی متخصص در تمام ساعات شبانه‌روز آماده پاسخگویی به سوالات و حل مشکلات شما
              </p>
            </div>

            <div className='group bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border border-orange-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2'>
              <div className='w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                <span className='text-2xl text-white'>🔒</span>
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-4'>امنیت بالا</h3>
              <p className='text-gray-600 leading-relaxed'>
                حفاظت از اطلاعات شخصی و پزشکی بیماران با استفاده از پیشرفته‌ترین استانداردهای امنیتی
              </p>
            </div>

            <div className='group bg-gradient-to-br from-pink-50 to-pink-100 p-8 rounded-2xl border border-pink-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2'>
              <div className='w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                <span className='text-2xl text-white'>📊</span>
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-4'>گزارش‌گیری</h3>
              <p className='text-gray-600 leading-relaxed'>
                امکان مشاهده تاریخچه ویزیت‌ها و دریافت گزارش‌های پزشکی به صورت آنلاین
              </p>
            </div>

            <div className='group bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-2xl border border-indigo-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2'>
              <div className='w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                <span className='text-2xl text-white'>🎯</span>
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-4'>دقت بالا</h3>
              <p className='text-gray-600 leading-relaxed'>
                سیستم هوشمند پیشنهاد پزشکان بر اساس نیازها و موقعیت جغرافیایی شما
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className='py-20 bg-gradient-to-r from-primary to-blue-600'>
        <div className='container mx-auto px-4 max-w-[1300px]'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            <div className='bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20'>
              <h3 className='text-2xl font-bold text-white mb-6'>مأموریت ما</h3>
              <p className='text-white/90 leading-relaxed text-lg'>
                هدف ما بهبود دسترسی مردم به خدمات پزشکی با کیفیت است.
                باور داریم که هر فردی باید بتواند به راحتی به پزشک مورد نیاز خود دسترسی پیدا کند
                و این امر با استفاده از فناوری‌های نوین امکان‌پذیر است.
              </p>
            </div>
            <div className='bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20'>
              <h3 className='text-2xl font-bold text-white mb-6'>چشم‌انداز ما</h3>
              <p className='text-white/90 leading-relaxed text-lg'>
                تبدیل شدن به بزرگترین و معتبرترین پلتفرم نوبت‌دهی پزشکی در خاورمیانه
                و ارائه خدمات بهداشتی دیجیتال به میلیون‌ها نفر در سراسر منطقه.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className='py-20 bg-gray-900 text-white'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-6'>آماده شروع هستید؟</h2>
          <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
            همین حالا شروع کنید و از خدمات پزشکی آنلاین نیلودرمان بهره‌مند شوید
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <a
              href="/doctors"
              className='inline-block bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
            >
              جستجوی پزشکان
            </a>
            <a
              href="/service-categories"
              className='inline-block bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
            >
              مشاهده خدمات
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;