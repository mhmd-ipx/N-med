import { useState, useEffect, useRef } from 'react';
import Menu from '../../ui/Menu';
import Headerbuttons from './buttons';
import HeaderLogo from './HeaderLogo';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
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
        <nav className="w-full max-w-[1300px] mx-auto px-4 py-4 flex items-center">
          <div className="basis-1/4">
            <HeaderLogo />
          </div>
          <div className="basis-2/4 flex justify-center">
            <Menu />
          </div>
          <div className="basis-1/4 flex justify-end">
            <Headerbuttons />
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;