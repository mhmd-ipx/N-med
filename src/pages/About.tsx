import { Helmet } from 'react-helmet-async';

function About() {
  return (
    <div className='w-full justify-center items-center flex'>
      <Helmet>
        <title>درباره ما</title>
      </Helmet>
      <div className='w-full'>
        {/* About Hero Section */}
        <section className='bg-primary py-12 md:py-16'>
          <div className='container mx-auto px-4 text-center'>
            <h1 className='text-2xl md:text-4xl font-bold mb-4 text-white'>درباره نوتاش</h1>
            <p className='text-base md:text-lg text-white/90 max-w-2xl mx-auto'>
              پلتفرم نوبت‌دهی آنلاین پزشکی با بهترین پزشکان و خدمات درمانی
            </p>
          </div>
        </section>

        {/* About Content Section */}
        <section className='py-12 md:py-16'>
          <div className='container mx-auto px-4'>
            <div className='max-w-4xl mx-auto'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center mb-12'>
                <div>
                  <h2 className='text-2xl md:text-3xl font-bold mb-6'>چرا نوتاش؟</h2>
                  <div className='space-y-4 text-gray-700'>
                    <p className='text-sm md:text-base leading-relaxed'>
                      نوتاش پلتفرمی است که دسترسی به خدمات پزشکی را برای همه آسان کرده است.
                      با استفاده از نوتاش می‌توانید به راحتی پزشک مورد نظر خود را پیدا کنید و نوبت خود را رزرو کنید.
                    </p>
                    <p className='text-sm md:text-base leading-relaxed'>
                      ما با همکاری بهترین پزشکان و متخصصان حوزه سلامت، خدماتی با کیفیت بالا ارائه می‌دهیم
                      تا تجربه‌ای بی‌نظیر از دریافت خدمات پزشکی داشته باشید.
                    </p>
                  </div>
                </div>
                <div className='bg-gray-100 rounded-2xl p-6 md:p-8'>
                  <img
                    src='/public/n-med-logo.png'
                    alt='نوتاش'
                    className='w-full h-auto max-w-xs mx-auto'
                  />
                </div>
              </div>

              {/* Features Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
                <div className='text-center p-4 md:p-6 bg-white rounded-xl shadow-sm border'>
                  <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                    <span className='text-white text-xl'>🩺</span>
                  </div>
                  <h3 className='font-semibold mb-2'>پزشکان متخصص</h3>
                  <p className='text-sm text-gray-600'>دسترسی به بهترین پزشکان متخصص در سراسر کشور</p>
                </div>

                <div className='text-center p-4 md:p-6 bg-white rounded-xl shadow-sm border'>
                  <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                    <span className='text-white text-xl'>📱</span>
                  </div>
                  <h3 className='font-semibold mb-2'>رزرو آنلاین</h3>
                  <p className='text-sm text-gray-600'>رزرو نوبت به صورت آنلاین و در کمترین زمان ممکن</p>
                </div>

                <div className='text-center p-4 md:p-6 bg-white rounded-xl shadow-sm border'>
                  <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                    <span className='text-white text-xl'>💬</span>
                  </div>
                  <h3 className='font-semibold mb-2'>پشتیبانی ۲۴ ساعته</h3>
                  <p className='text-sm text-gray-600'>پشتیبانی فنی و پزشکی در تمام ساعات شبانه‌روز</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className='py-12 md:py-16 bg-gray-50'>
          <div className='container mx-auto px-4 text-center'>
            <h2 className='text-2xl md:text-3xl font-bold mb-6'>مأموریت ما</h2>
            <p className='text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed'>
              هدف ما بهبود دسترسی مردم به خدمات پزشکی با کیفیت است.
              باور داریم که هر فردی باید بتواند به راحتی به پزشک مورد نیاز خود دسترسی پیدا کند
              و این امر با استفاده از فناوری‌های نوین امکان‌پذیر است.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
export default About;