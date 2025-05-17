import { useState, useEffect } from 'react';
import Menu from '../../ui/Menu';
import Headerbuttons from './buttons';
import HeaderLogo from './HeaderLogo'; 
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
          <header
            className={`fixed p-0 top-0 left-0 w-full text-black z-50 items-center transition-colors duration-300 ${
              isScrolled ? 'bg-primary' : 'bg-transparent'
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

  );
};

export default Header;