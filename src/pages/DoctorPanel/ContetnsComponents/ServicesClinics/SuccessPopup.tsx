import { useEffect } from 'react';
import { HiOutlineCheckCircle } from 'react-icons/hi2';

interface SuccessPopupProps {
  message: string;
  onClose: () => void;
}

const SuccessPopup = ({ message, onClose }: SuccessPopupProps) => {
  // بستن خودکار پاپ‌آپ بعد از 3 ثانیه
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center gap-2 z-50">
      <HiOutlineCheckCircle className="text-xl" />
      <p>{message}</p>
    </div>
  );
};

export default SuccessPopup;