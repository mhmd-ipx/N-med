import { useState, useEffect, useRef } from 'react';
import { HiOutlineBars3, HiOutlineXMark, HiOutlinePhone, HiOutlineGlobeAlt, HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import Menu from '../../ui/Menu';
import Headerbuttons from './buttons';
import HeaderLogo from './HeaderLogo';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    // محاسبه ارتفاع هدر هنگام لود و تغییر اندازه پنجره
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    // فراخوانی اولیه برای محاسبه ارتفاع
    updateHeaderHeight();

    // اضافه کردن event listener برای تغییر اندازه پنجره
    window.addEventListener('resize', updateHeaderHeight);

    // مدیریت اسکرول
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // پاک‌سازی event listenerها
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Placeholder برای حفظ فضا در حالت فیکسد */}
      <div
        style={{ height: isScrolled ? headerHeight : 0, display: isScrolled ? 'block' : 'none' }}
        className="transition-all duration-300 ease-in-out"
      />
      <header
        ref={headerRef}
        className={`w-full text-black z-50 items-center transition-all duration-300 ease-in-out bg-primary ${
          isScrolled ? 'fixed top-0 left-0 p-0 shadow-md' : 'relative'
        }`}
      >
        <nav className="w-full lg:max-w-[1300px] lg:mx-auto px-4 py-4 flex items-center justify-center lg:justify-start relative">
          {/* Logo */}
          <div className="flex-shrink-0">
            <HeaderLogo />
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-center">
            <Menu />
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex lg:justify-end lg:flex-1">
            <Headerbuttons />
          </div>

          {/* Mobile Menu Button */}
          <div className="absolute right-4 lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-white hover:text-primary-light transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <HiOutlineXMark className="text-2xl" />
              ) : (
                <HiOutlineBars3 className="text-2xl" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Sliding Menu */}
        <div className={`fixed inset-0 z-40 lg:hidden ${isMobileMenuOpen ? '' : 'pointer-events-none'}`}>
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'bg-opacity-70' : 'bg-opacity-0'}`}
            onClick={isMobileMenuOpen ? closeMobileMenu : undefined}
          ></div>
          <div className={`absolute top-0 right-0 h-full w-80 bg-gradient-to-b from-primary to-primary shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <HeaderLogo />
                <button onClick={closeMobileMenu} className="text-white hover:text-primary-light transition-colors">
                  <HiOutlineXMark className="text-3xl" />
                </button>
              </div>
              <Menu onItemClick={closeMobileMenu} />
              <div className="mt-8 pt-6 border-t border-primary-light">
                <Headerbuttons />
              </div>
              <div className="mt-6 pt-6 border-t border-primary-light">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white">
                    <HiOutlinePhone className="text-xl" />
                    <div>
                      <p className="text-sm font-medium">تماس با ما</p>
                      <p className="text-xs opacity-80">021-12345678</p>
                    </div>
                  </div>
                  <div className="text-white">
                    <p className="text-sm font-medium mb-3">شبکه های اجتماعی</p>
                    <div className="flex gap-4">
                      <HiOutlineChatBubbleLeftRight className="text-2xl hover:text-primary-light transition-colors cursor-pointer" title="تلگرام" />
                      <FaInstagram className="text-2xl hover:text-primary-light transition-colors cursor-pointer" title="اینستاگرام" />
                      <FaWhatsapp className="text-2xl hover:text-primary-light transition-colors cursor-pointer" title="واتس اپ" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;