/**
 * تابع helper برای logout کامل کاربر
 * این تابع تمامی داده‌های localStorage را پاک می‌کند و state کاربر را reset می‌کند
 */
export const performLogout = () => {
    // پاک کردن تمامی داده‌های مربوط به احراز هویت و cache
    const keysToRemove = [
        'authData',
        'userData',
        'appointments',
        'dashboardData',
        'referrals',
        'clinics_cache',
        'services_cache',
        'provinces'
    ];

    // حذف کلیدهای معین
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // حذف کلیدهای cache با pattern
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
        if (
            key.startsWith('operators_cache_') ||
            key.startsWith('user_times_cache_') ||
            key.endsWith('_cache')
        ) {
            localStorage.removeItem(key);
        }
    });

    // بروزرسانی Context کاربر به null
    window.dispatchEvent(new CustomEvent('userUpdated', { detail: null }));
};
