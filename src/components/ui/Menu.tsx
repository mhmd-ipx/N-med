import { NavLink } from 'react-router-dom';

const Menu = () => {
  const linkBaseClass = 'transition-colors px-2 text-white p-2  text-sm'; 

  const getLinkClass = (isActive: boolean) =>
    `${linkBaseClass} ${isActive ? ' underline  ' : 'text-black hover:text-primary-light'}`;

  return (
    <ul className="flex gap-4">
      <li>
        <NavLink to="/" className={({ isActive }) => getLinkClass(isActive)}>
          خانه
        </NavLink>
      </li>
      <li>
        <NavLink to="/categories" className={({ isActive }) => getLinkClass(isActive)}>
          دسته‌بندی‌ها
        </NavLink>
      </li>
      <li>
        <NavLink to="/appointments" className={({ isActive }) => getLinkClass(isActive)}>
          نوبت‌دهی آنلاین
        </NavLink>
      </li>
      <li>
        <NavLink to="/magazine" className={({ isActive }) => getLinkClass(isActive)}>
          مجله سلامتی نوتاش
        </NavLink>
      </li>
      <li>
        <NavLink to="/contact" className={({ isActive }) => getLinkClass(isActive)}>
          تماس با ما
        </NavLink>
      </li>
    </ul>
  );
};

export default Menu;
