import { NavLink } from 'react-router-dom';

interface MenuProps {
  onItemClick?: () => void;
}

const Menu = ({ onItemClick }: MenuProps) => {
  const linkBaseClass = 'transition-colors px-2 text-white p-2 text-sm rounded-md';

  const getLinkClass = (isActive: boolean) =>
    `${linkBaseClass} ${isActive ? ' text-blue font-bold shadow-md border border-white' : 'text-black hover:text-primary-light hover:bg-primary-light'}`;

  const handleLinkClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <ul className="flex flex-col lg:flex-row gap-4 lg:gap-4">
      <li>
        <NavLink to="/" className={({ isActive }) => getLinkClass(isActive)} onClick={handleLinkClick}>
          خانه
        </NavLink>
      </li>
      <li>
        <NavLink to="/service-categories" className={({ isActive }) => getLinkClass(isActive)} onClick={handleLinkClick}>
          دسته‌بندی خدمات
        </NavLink>
      </li>
      <li>
        <NavLink to="/doctors" className={({ isActive }) => getLinkClass(isActive)} onClick={handleLinkClick}>
          پزشکان
        </NavLink>
      </li>
      <li>
        <a
          href="https://blog.niloudarman.ir"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors px-2 text-white p-2 text-sm rounded-md text-black hover:text-primary-light hover:bg-primary-light"
          onClick={handleLinkClick}
        >
          مجله سلامتی نوتاش
        </a>
      </li>
      <li>
        <NavLink to="/about" className={({ isActive }) => getLinkClass(isActive)} onClick={handleLinkClick}>
          درباره ما
        </NavLink>
      </li>
      <li>
        <NavLink to="/contact" className={({ isActive }) => getLinkClass(isActive)} onClick={handleLinkClick}>
          تماس با ما
        </NavLink>
      </li>
    </ul>
  );
};

export default Menu;
