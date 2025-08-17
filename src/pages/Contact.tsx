import { Helmet } from 'react-helmet-async';

function Contact() {
  return (
    <div className='w-full justify-center items-center flex'>
      <Helmet>
        <title>تماس با ما</title>
      </Helmet>
      <div className='w-full'>
        {/* Contact Hero Section */}
        <section className='bg-gray-100 py-16'>
          <div className='container mx-auto px-4 text-center'>
            <h1 className='text-4xl font-bold mb-4'>تماس با ما</h1>
            <p className='text-lg text-gray-600'>
              با ما در ارتباط باشید تا بتوانیم به سوالات شما پاسخ دهیم یا خدمات مورد نیازتان را فراهم کنیم.
            </p>
          </div>
        </section>

        {/* Contact Form and Info Section */}
        <section className='py-16'>
          <div className='container mx-auto px-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {/* Contact Form */}
              <div>
                <h2 className='text-2xl font-semibold mb-6'>ارسال پیام</h2>
                <div className='space-y-4'>
                  <div>
                    <label htmlFor='name' className='block text-sm font-medium text-gray-700'>نام</label>
                    <input
                      type='text'
                      id='name'
                      className='mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='نام کامل خود را وارد کنید'
                    />
                  </div>
                  <div>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-700'>ایمیل</label>
                    <input
                      type='email'
                      id='email'
                      className='mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='ایمیل خود را وارد کنید'
                    />
                  </div>
                  <div>
                    <label htmlFor='message' className='block text-sm font-medium text-gray-700'>پیام</label>
                    <textarea
                      id='message'
                      
                      className='mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='پیام خود را بنویسید'
                    ></textarea>
                  </div>
                  <button
                    className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300'
                    onClick={() => alert('فرم ارسال شد!')}
                  >
                    ارسال پیام
                  </button>
                </div>
              </div>
              {/* Contact Information */}
              <div>
                <h2 className='text-2xl font-semibold mb-6'>اطلاعات تماس</h2>
                <div className='space-y-4'>
                  <div className='flex items-center'>
                    <svg className='w-6 h-6 text-blue-600 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'></path>
                    </svg>
                    <p>ایمیل: info@example.com</p>
                  </div>
                  <div className='flex items-center'>
                    <svg className='w-6 h-6 text-blue-600 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'></path>
                    </svg>
                    <p>تلفن: ۱۲۳۴-۵۶۷-۸۹۰</p>
                  </div>
                  <div className='flex items-center'>
                    <svg className='w-6 h-6 text-blue-600 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z'></path>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'></path>
                    </svg>
                    <p>آدرس: تهران، خیابان نمونه، پلاک ۱۲۳</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className='py-16 bg-gray-100'>
          <div className='container mx-auto px-4'>
            <h2 className='text-2xl font-semibold mb-6 text-center'>موقعیت ما</h2>
            <div className='w-full h-96 bg-gray-300 rounded-md flex items-center justify-center'>
              <p className='text-gray-600'>نقشه گوگل (به زودی اضافه خواهد شد)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contact;