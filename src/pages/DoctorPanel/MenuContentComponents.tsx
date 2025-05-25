type ProfileInfoProps = {
  user: {
    name?: string;
    email?: string;
  };
  token: string | null | undefined;
};

const ProfileInfo = ({ user, token }: ProfileInfoProps) => (
  <div className="p-4">
    <h2 className="text-xl font-semibold mb-4">اطلاعات پروفایل پزشک</h2>
    <p>نام: {user.name || 'پزشک'}</p>
    <p>ایمیل: {user.email || 'ایمیل'}</p>
    <p>توکن: {token ? 'فعال' : 'غیرفعال'}</p>
  </div>
);

const Appointments = () => (
  <div className="p-4">
    <h2 className="text-xl font-semibold mb-4">وقت‌های ملاقات</h2>
    <p>لیست وقت‌های ملاقات پزشک...</p>
  </div>
);

const MedicalRecords = () => (
  <div className="p-4">
    <h2 className="text-xl font-semibold mb-4">سوابق پزشکی</h2>
    <p>سوابق پزشکی بیماران...</p>
  </div>
);

const Settings = () => (
  <div className="p-4">
    <h2 className="text-xl font-semibold mb-4">تنظیمات</h2>
    <p>تنظیمات حساب کاربری...</p>
  </div>
);

export { ProfileInfo, Appointments, MedicalRecords, Settings };