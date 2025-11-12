// src/components/Footer.tsx
import enamad from '../../assets/images/enamad.png';
import avafarda from '../../assets/images/avafarda.svg';
import { HiHome, HiFolder, HiUserGroup, HiBookOpen, HiUsers, HiPhone, HiInformationCircle, HiEnvelope, HiMapPin, HiLink, HiChatBubbleOvalLeft, HiPhoto } from 'react-icons/hi2';
import logo from '../../assets/images/n-med-logo.png';

const Footer = () => {
    return (
      <footer className="bg-blue-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 opacity-95"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>

        <div className="relative max-w-[1300px] mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="p-2 bg-white rounded-xl shadow-lg">
                  <img src={logo} alt="نیلودرمان لوگو" className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">نیلودرمان</h3>
              </div>
              <p className="text-white/90 leading-relaxed text-sm">
                نیلودرمان پلتفرمی نوین برای نوبت‌دهی آنلاین پزشکی است که با همکاری بهترین پزشکان متخصص در سراسر کشور، امکان دسترسی آسان و سریع به خدمات درمانی را برای شما فراهم کرده است. ما با استفاده از فناوری‌های پیشرفته، تجربه‌ای بی‌نظیر از رزرو نوبت، مشاوره پزشکی و مدیریت سلامت شخصی ارائه می‌دهیم. اعتماد شما به ما، انگیزه‌ای برای بهبود مداوم کیفیت خدماتمان است.
              </p>
              <div className="flex space-x-3 space-x-reverse">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <HiLink className="w-4 h-4 text-white" />
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <HiChatBubbleOvalLeft className="w-4 h-4 text-white" />
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <HiPhoto className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <h4 className="text-lg font-semibold text-white mb-4">لینک‌های سریع</h4>
              <ul className="space-y-3">
                <li><a href="/" className="flex items-center space-x-2 space-x-reverse text-white/90 hover:text-white transition-all duration-300 hover:translate-x-1"><HiHome className="w-4 h-4 text-white" /><span className="text-sm">خانه</span></a></li>
                <li><a href="/categories" className="flex items-center space-x-2 space-x-reverse text-white/90 hover:text-white transition-all duration-300 hover:translate-x-1"><HiFolder className="w-4 h-4 text-white" /><span className="text-sm">دسته‌بندی‌ها</span></a></li>
                <li><a href="/doctors" className="flex items-center space-x-2 space-x-reverse text-white/90 hover:text-white transition-all duration-300 hover:translate-x-1"><HiUserGroup className="w-4 h-4 text-white" /><span className="text-sm">پزشکان</span></a></li>
                <li><a href="/magazine" className="flex items-center space-x-2 space-x-reverse text-white/90 hover:text-white transition-all duration-300 hover:translate-x-1"><HiBookOpen className="w-4 h-4 text-white" /><span className="text-sm">مجله سلامتی</span></a></li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <h4 className="text-lg font-semibold text-white mb-4">خدمات</h4>
              <ul className="space-y-3">
                <li><a href="/doctor-Profile" className="flex items-center space-x-2 space-x-reverse text-white/90 hover:text-white transition-all duration-300 hover:translate-x-1"><HiUserGroup className="w-4 h-4 text-white" /><span className="text-sm">پرتال پزشکان</span></a></li>
                <li><a href="/UserProfile" className="flex items-center space-x-2 space-x-reverse text-white/90 hover:text-white transition-all duration-300 hover:translate-x-1"><HiUsers className="w-4 h-4 text-white" /><span className="text-sm">پنل بیماران</span></a></li>
                <li><a href="/contact" className="flex items-center space-x-2 space-x-reverse text-white/90 hover:text-white transition-all duration-300 hover:translate-x-1"><HiPhone className="w-4 h-4 text-white" /><span className="text-sm">تماس با ما</span></a></li>
                <li><a href="/about" className="flex items-center space-x-2 space-x-reverse text-white/90 hover:text-white transition-all duration-300 hover:translate-x-1"><HiInformationCircle className="w-4 h-4 text-white" /><span className="text-sm">درباره ما</span></a></li>
              </ul>
            </div>

            {/* Contact Info & Trust */}
            <div className="space-y-6">
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h4 className="text-lg font-semibold text-white mb-4">تماس با ما</h4>
                <div className="space-y-3 text-sm text-white/90">
                  <p className="flex items-center space-x-2 space-x-reverse"><HiPhone className="w-4 h-4 text-white" /><span>031-35548186</span></p>
                  <p className="flex items-center space-x-2 space-x-reverse"><HiEnvelope className="w-4 h-4 text-white" /><span>Info@niloodarman.com</span></p>
                  <p className="flex items-center space-x-2 space-x-reverse"><HiMapPin className="w-4 h-4 text-white" /><span>اصفهان ، شهرک سلامت ، طبقه ی همکف ، واحد ۲۱
</span></p>
                </div>
              </div>

              {/* Trust Symbol */}
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 text-center">
                <h4 className="text-lg font-semibold text-white mb-4">نماد اعتماد</h4>
                <div className="bg-white/10 p-3 rounded-xl inline-block">
                  <img src={enamad} alt="نماد اعتماد الکترونیکی" className="w-16 h-16" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
              <p className="text-white/70 text-center md:text-right text-sm">
                © کپی‌رایت ۱۴۰۳ نیلودرمان. تمامی حقوق محفوظ است.
              </p>
              <div className="flex items-center space-x-3 space-x-reverse bg-white/10 px-4 py-2 rounded-full border border-white/20">
                <span className="text-sm text-white/70">طراحی و توسعه توسط:</span>
                <a href="https://avayefardamedia.com/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 space-x-reverse hover:scale-105 transition-transform duration-300">
                  <div className="p-1 bg-white/20 rounded-lg">
                    <img src={avafarda} alt="آوای فردا" className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-white">آوای فردا</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  };

  export default Footer;