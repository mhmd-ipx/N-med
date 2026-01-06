import { useState } from 'react';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { performLogout } from '../../utils/logout';

interface LogOutProps {
  onClose: () => void;
}

const LogOut: React.FC<LogOutProps> = ({ onClose }) => {
  const [showModal, setShowModal] = useState(true);

  const handleConfirm = () => {
    // پاک کردن تمام داده‌ها
    performLogout();

    // بستن modal
    setShowModal(false);
    onClose();

    // هدایت به صفحه اصلی با force reload
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  };

  const handleCancel = () => {
    setShowModal(false);
    onClose();
  };

  return (
    <ConfirmModal
      isOpen={showModal}
      title="خروج از حساب کاربری"
      message="آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟"
      confirmText="بله، خروج"
      cancelText="لغو"
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );
};

export default LogOut;