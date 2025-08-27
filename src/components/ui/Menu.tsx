import { NavLink } from 'react-router-dom';

interface MenuProps {
  onItemClick?: () => void;
}

const Menu = ({ onItemClick }: MenuProps) => {
  const linkBaseClass = 'transition-colors px-2 text-white p-2 text-sm';

  const getLinkClass = (isActive: boolean) =>
    `${linkBaseClass} ${isActive ? ' underline  ' : 'text-black hover:text-primary-light'}`;

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
        <NavLink to="/categories" className={({ isActive }) => getLinkClass(isActive)} onClick={handleLinkClick}>
          دسته‌بندی‌ها
        </NavLink>
      </li>
      <li>
        <NavLink to="/appointments" className={({ isActive }) => getLinkClass(isActive)} onClick={handleLinkClick}>
          نوبت‌دهی آنلاین
        </NavLink>
      </li>
      <li>
        <NavLink to="/magazine" className={({ isActive }) => getLinkClass(isActive)} onClick={handleLinkClick}>
          مجله سلامتی نوتاش
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
