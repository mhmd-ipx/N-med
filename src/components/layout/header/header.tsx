import { useState, useEffect, useRef } from 'react';
import { HiOutlineBars3, HiOutlineXMark } from 'react-icons/hi2';
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
        <nav className="w-full max-w-[1300px] mx-auto px-4 py-4 flex items-center justify-between lg:justify-start">
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
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-white hover:text-primary-light transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <HiOutlineXMark className="text-2xl" />
            ) : (
              <HiOutlineBars3 className="text-2xl" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-primary border-t border-primary-light">
            <div className="px-4 py-4 space-y-4">
              <Menu onItemClick={closeMobileMenu} />
              <div className="pt-4 border-t border-primary-light">
                <Headerbuttons />
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;