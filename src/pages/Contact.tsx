import { Helmet } from 'react-helmet-async';

function Contact() {
  return (
    <div className='w-full'>
      <Helmet>
        <title>تماس با ما - کلینیک پزشکی</title>
        <meta name="description" content="با ما تماس بگیرید برای رزرو نوبت، مشاوره پزشکی و سوالات شما. اطلاعات تماس، ساعات کاری و شبکه‌های اجتماعی." />
      </Helmet>

      {/* Hero Section */}
      <section className='bg-gradient-to-r from-blue-600 to-purple-700 py-16 md:py-24 text-white'>
        <div className='container mx-auto px-4 text-center max-w-[1300px]'>
          <h1 className='text-3xl md:text-5xl font-bold mb-6 animate-fade-in'>تماس با ما</h1>
          <p className='text-lg md:text-xl max-w-3xl mx-auto leading-relaxed'>
            آماده‌ایم تا به سوالات شما پاسخ دهیم، نوبت رزرو کنیم یا خدمات پزشکی آنلاین ارائه دهیم.
            با تیم حرفه‌ای ما در تماس باشید و از مراقبت‌های بهداشتی با کیفیت بهره‌مند شوید.
          </p>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className='py-16 md:py-24 bg-gray-50'>
        <div className='container mx-auto px-4 max-w-[1300px]'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* Contact Form */}
            <div className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300'>
              <h2 className='text-2xl md:text-3xl font-semibold mb-8 text-gray-800'>ارسال پیام</h2>
              <form className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-2'>نام و نام خانوادگی</label>
                    <input
                      type='text'
                      id='name'
                      className='w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
                      placeholder='نام کامل خود را وارد کنید'
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-2'>شماره تلفن</label>
                    <input
                      type='tel'
                      id='phone'
                      className='w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
                      placeholder='۰۹۱۲۳۴۵۶۷۸۹'
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>ایمیل</label>
                  <input
                    type='email'
                    id='email'
                    className='w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
                    placeholder='example@email.com'
                    required
                  />
                </div>
                <div>
                  <label htmlFor='subject' className='block text-sm font-medium text-gray-700 mb-2'>موضوع</label>
                  <input
                    type='text'
                    id='subject'
                    className='w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
                    placeholder='موضوع پیام خود را وارد کنید'
                  />
                </div>
                <div>
                  <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-2'>پیام</label>
                  <textarea
                    id='message'
                    rows={5}
                    className='w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none'
                    placeholder='پیام خود را بنویسید...'
                    required
                  ></textarea>
                </div>
                <button
                  type='submit'
                  className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-300 font-semibold text-lg shadow-md hover:shadow-lg'
                >
                  ارسال پیام
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className='space-y-8'>
              <div className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300'>
                <h2 className='text-2xl md:text-3xl font-semibold mb-8 text-gray-800'>اطلاعات تماس</h2>
                <div className='space-y-6'>
                  <div className='flex items-start gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition duration-200'>
                    <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'>
                      <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'></path>
                      </svg>
                    </div>
                    <div>
                      <p className='font-semibold text-gray-900'>ایمیل</p>
                      <p className='text-gray-600'>Info@niloodarman.com</p>
                    </div>
                  </div>
                  <div className='flex items-start gap-4 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition duration-200'>
                    <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
                      <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'></path>
                      </svg>
                    </div>
                    <div>
                      <p className='font-semibold text-gray-900'>تلفن</p>
                      <p className='text-gray-600'>031-35548186</p>
                      
                    </div>
                  </div>
                  <div className='flex items-start gap-4 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition duration-200'>
                    <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0'>
                      <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z'></path>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'></path>
                      </svg>
                    </div>
                    <div>
                      <p className='font-semibold text-gray-900'>آدرس</p>
                      <p className='text-gray-600'>اصفهان ، شهرک سلامت ، طبقه ی همکف ، واحد ۲۱
</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300'>
                <h3 className='text-xl md:text-2xl font-semibold mb-6 text-gray-800'>ساعات کاری</h3>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-gray-700'>شنبه تا چهارشنبه</span>
                    <span className='font-medium'>۸:۰۰ صبح تا ۸:۰۰ عصر</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-700'>پنج‌شنبه</span>
                    <span className='font-medium'>۸:۰۰ صبح تا ۲:۰۰ بعدازظهر</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-700'>جمعه</span>
                    <span className='font-medium'>تعطیل</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4 text-center max-w-[1300px]'>
          <h2 className='text-2xl md:text-3xl font-semibold mb-8 text-gray-800'>ما را در شبکه‌های اجتماعی دنبال کنید</h2>
          <div className='flex justify-center space-x-6 rtl:space-x-reverse'>
            <a href='#' className='w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition duration-300'>
              <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z'/>
              </svg>
            </a>
            <a href='#' className='w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition duration-300'>
              <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.012.017z'/>
              </svg>
            </a>
            <a href='#' className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition duration-300'>
              <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z'/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className='py-16 md:py-24 bg-gray-50'>
        <div className='container mx-auto px-4 max-w-[1300px]'>
          <h2 className='text-2xl md:text-3xl font-semibold mb-8 text-center text-gray-800'>موقعیت ما روی نقشه</h2>
          <div className='w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg'>
            <div className='text-center'>
              <svg className='w-16 h-16 text-blue-600 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z'></path>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'></path>
              </svg>
              <p className='text-gray-600 text-lg'>نقشه تعاملی گوگل به زودی اضافه خواهد شد</p>
              <p className='text-gray-500 mt-2'>برای مسیر‌یابی، از آدرس بالا استفاده کنید</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;