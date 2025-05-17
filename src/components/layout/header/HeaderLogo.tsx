import logo from '../../../assets/images/n-med-logo.png'; 

const HeaderLogo = () => {
    return (
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        <h1 className="text-xl font-bold text-white">نوتاش مد</h1>
      </div>
    );
  };
  
  export default HeaderLogo;