import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import SearchInput from '../components/ui/SearchInput/SearchInput';

function Categories() {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 1, name: 'سلامت روان', description: 'تست‌ها و مقالات مرتبط با سلامت روان و کاهش استرس', image: 'https://snn.ir/files/fa/news/1397/3/12/299552_902.jpg' },
    { id: 2, name: 'سلامت قلب', description: 'منابع و تست‌های مربوط به سلامت قلب و عروق', image: 'https://snn.ir/files/fa/news/1397/3/12/299552_902.jpg' },
    { id: 3, name: 'تغذیه', description: 'راهنمایی‌ها و تست‌های رژیم غذایی و تغذیه سالم', image: 'https://snn.ir/files/fa/news/1397/3/12/299552_902.jpg' },
    { id: 4, name: 'خواب', description: 'تست‌ها و نکات برای بهبود کیفیت خواب', image: 'https://snn.ir/files/fa/news/1397/3/12/299552_902.jpg' },
    { id: 5, name: 'ورزش و تناسب اندام', description: 'برنامه‌ها و تست‌های تناسب اندام', image: 'https://snn.ir/files/fa/news/1397/3/12/299552_902.jpg' },
    { id: 6, name: 'سلامت عمومی', description: 'اطلاعات و تست‌های عمومی سلامت', image: 'https://snn.ir/files/fa/news/1397/3/12/299552_902.jpg' },
  ];

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='w-full justify-center items-center flex'>
      <Helmet>
        <title>دسته‌بندی‌ها</title>
      </Helmet>
      <div className='w-full'>
        {/* Categories Hero Section */}
        <section className='bg-gray-100 py-16'>
          <div className='container mx-auto px-4 text-center'>
            <h1 className='text-4xl font-bold mb-4'>دسته‌بندی‌های سلامت</h1>
            <p className='text-lg text-gray-600'>
              دسته‌بندی‌های مختلف سلامت را کاوش کنید و منابع مرتبط را پیدا کنید.
            </p>
          </div>
        </section>

        {/* Search Section */}


        {/* Categories Grid Section */}
        <section className='py-16'>
          <div className='container mx-auto px-4'>
            <h2 className='text-2xl font-semibold mb-6'>همه دسته‌بندی‌ها</h2>
            {filteredCategories.length === 0 ? (
              <div className='text-center text-gray-600'>هیچ دسته‌بندی‌ای یافت نشد</div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                {filteredCategories.map((category) => (
                  <div key={category.id} className='bg-white shadow-md rounded-md overflow-hidden'>
                    <img
                      src={category.image}
                      alt={category.name}
                      className='w-full h-48 object-cover'
                    />
                    <div className='p-4'>
                      <h3 className='text-xl font-semibold mb-2'>{category.name}</h3>
                      <p className='text-gray-600 mb-4'>{category.description}</p>
                      <a
                        href='#'
                        className='text-blue-600 hover:underline'
                        onClick={() => alert(`مشاهده ${category.name}`)}
                      >
                        مشاهده جزئیات
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Categories;