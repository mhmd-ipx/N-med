import { Link } from 'react-router-dom';
import logo from '../../../assets/images/n-med-logo.png';

const HeaderLogo = () => {
    return (
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        <h1 className="text-xl font-bold text-white">نیلو درمان</h1>
      </Link>
    );
};

export default HeaderLogo;