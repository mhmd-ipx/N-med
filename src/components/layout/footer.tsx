// src/components/Footer.tsx
const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white">
        <div className="max-w-[1300px] mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary-light">نوتاش</h3>
              <p className="text-sm text-gray-300">
                پلتفرم نوبت‌دهی آنلاین پزشکی با بهترین پزشکان و خدمات درمانی
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-md font-medium">لینک‌های سریع</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/" className="hover:text-white transition-colors">خانه</a></li>
                <li><a href="/categories" className="hover:text-white transition-colors">دسته‌بندی‌ها</a></li>
                <li><a href="/appointments" className="hover:text-white transition-colors">نوبت‌دهی آنلاین</a></li>
                <li><a href="/magazine" className="hover:text-white transition-colors">مجله سلامتی</a></li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-md font-medium">خدمات</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/doctor-Profile" className="hover:text-white transition-colors">پرتال پزشکان</a></li>
                <li><a href="/UserProfile" className="hover:text-white transition-colors">پنل بیماران</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">تماس با ما</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">درباره ما</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-md font-medium">تماس با ما</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</p>
                <p>ایمیل: info@notash.ir</p>
                <p>آدرس: تهران، خیابان ولیعصر</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-sm text-gray-400">
              &copy; ۱۴۰۳ نوتاش. تمامی حقوق محفوظ است.
            </p>
          </div>
        </div>
      </footer>
    );
  };

  export default Footer;