import React from "react";

const References = () => {
  // دیتای تستی
  const user = {
    name: "محمد ای پی",
    phone: "09138579706",
    email: "mohammad@example.com",
    clinics: [
      { id: 1, name: "کلینیک مهر", address: "اصفهان، خیابان فلان" },
      { id: 2, name: "کلینیک سلامت", address: "تهران، خیابان بهمان" },
    ],
    appointmentsCount: 12,
    medicalRecordsCount: 4,
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">داشبورد</h2>

      <div className="mb-4 border p-3 rounded-xl shadow">
        <h3 className="font-semibold">اطلاعات کاربر</h3>
        <p>نام: {user.name}</p>
        <p>شماره موبایل: {user.phone}</p>
        <p>ایمیل: {user.email}</p>
      </div>

      <div className="mb-4 border p-3 rounded-xl shadow">
        <h3 className="font-semibold mb-2">کلینیک‌های من</h3>
        <ul className="list-disc pr-4">
          {user.clinics.map((clinic) => (
            <li key={clinic.id}>
              {clinic.name} - {clinic.address}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4">
        <div className="border p-3 rounded-xl shadow flex-1">
          <h3 className="font-semibold">تعداد ملاقات‌ها</h3>
          <p className="text-xl">{user.appointmentsCount}</p>
        </div>
        <div className="border p-3 rounded-xl shadow flex-1">
          <h3 className="font-semibold">سوابق پزشکی</h3>
          <p className="text-xl">{user.medicalRecordsCount}</p>
        </div>
      </div>
    </div>
  );
};

export default References;
