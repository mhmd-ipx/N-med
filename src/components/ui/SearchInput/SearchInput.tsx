import { useEffect, useState } from "react";
import { HiOutlineMap, HiOutlineSearch } from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getProvinces, getDoctors, getSpecialties } from '../../../services/publicApi';
import type { Province, Doctor, Specialty, DoctorsResponse } from '../../../services/publicApi';
import { Link } from "react-router-dom";
import Button from '../../ui/Button';
import defaultSpecialtyImage from '../../../assets/images/specialty/Heart.svg';

const SearchInput = () => {
  const [selectedProvince, setSelectedProvince] = useState<number>(0); // مقدار پیش‌فرض به 0 (همه استان‌ها) تغییر یافت
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState<Doctor[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);

  // کش کردن و دریافت استان‌ها
  useEffect(() => {
    const cachedProvinces = localStorage.getItem("provinces");
    if (cachedProvinces) {
      try {
        const parsedProvinces = JSON.parse(cachedProvinces);
        // اضافه کردن گزینه "همه استان‌ها"
        setProvinces([{ id: 0, enname: "All", faname: "همه استان‌ها", created_at: "", updated_at: "" }, ...parsedProvinces]);
      } catch (error) {
        console.error("homeapi: Error parsing cached provinces", error);
      }
    } else {
      getProvinces()
        .then(data => {
          // اضافه کردن گزینه "همه استان‌ها"
          setProvinces([{ id: 0, enname: "All", faname: "همه استان‌ها", created_at: "", updated_at: "" }, ...data]);
          localStorage.setItem("provinces", JSON.stringify(data));
        })
        .catch(error => {
          console.error("homeapi: Error fetching provinces", error);
        });
    }
  }, []);

  // دریافت تخصص‌ها
  useEffect(() => {
    getSpecialties()
      .then(data => {
        setSpecialties(data);
      })
      .catch(error => console.error("homeapi: Error fetching specialties:", error));
  }, []);

  // دریافت پزشکان
  useEffect(() => {
    setIsLoadingDoctors(true);
    getDoctors()
      .then((data: DoctorsResponse) => {
        setDoctors(data.data);
        setIsLoadingDoctors(false);
      })
      .catch(error => {
        console.error("homeapi: Error fetching doctors:", error);
        setIsLoadingDoctors(false);
      });
  }, []);

  // فیلتر کردن نتایج جستجو
  useEffect(() => {
    // اگر عبارتی برای جستجو وارد نشده باشد، نتایج را خالی کن.
    if (searchTerm.trim() === "") {
      setFilteredResults([]);
      return;
    }

    const results = doctors.filter(doc => {
      // فیلتر بر اساس استان - فعلاً این قسمت را غیرفعال می‌کنیم چون ساختار API تغییر کرده
      const hasMatchingClinic = true; // selectedProvince === 0 || doc.clinics.some(clinic => true);

      if (!hasMatchingClinic) return false;

      // جستجو بر اساس نام پزشک یا تخصص
      const nameMatch = doc.user.name.toLowerCase().includes(searchTerm.toLowerCase());

      // جستجو بر اساس تخصص - بررسی انواع مختلف داده
      let specialtyMatch = false;
      if (doc.specialties) {
        if (typeof doc.specialties === 'string') {
          // اگر رشته است
          specialtyMatch = doc.specialties.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (Array.isArray(doc.specialties)) {
          // اگر آرایه است، بررسی هر عنصر
          specialtyMatch = (doc.specialties as any[]).some((specialty: any) => {
            if (typeof specialty === 'string') {
              return specialty.toLowerCase().includes(searchTerm.toLowerCase());
            } else if (typeof specialty === 'object' && specialty?.name) {
              return specialty.name.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return false;
          });
        }
      }

      return nameMatch || specialtyMatch;
    });

    setFilteredResults(results);
  }, [searchTerm, selectedProvince, doctors]);

  const getSpecialtyNames = (specialties: string | null | any[]): string => {
    if (!specialties) return "بدون تخصص";

    if (typeof specialties === 'string') {
      return specialties;
    }

    if (Array.isArray(specialties)) {
      // اگر آرایه است، نام تخصص‌ها را استخراج کن
      const names = specialties.map((specialty: any) => {
        if (typeof specialty === 'string') {
          return specialty;
        } else if (typeof specialty === 'object' && specialty?.name) {
          return specialty.name;
        } else if (typeof specialty === 'number') {
          // اگر ID عددی است، بعداً می‌توانیم نام را از لیست تخصص‌ها پیدا کنیم
          return `تخصص ${specialty}`;
        }
        return '';
      }).filter(name => name !== '');

      return names.length > 0 ? names.join(', ') : "بدون تخصص";
    }

    return "بدون تخصص";
  };

  return (
    <div className="relative w-full mx-auto">
      <div className="relative w-full sm:w-[80%] mx-auto px-4 sm:px-0">
        <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm -mt-5">
          {/* انتخاب استان */}
          <div className="flex items-center p-2 pr-4">
            <HiOutlineMap className="text-primary text-lg sm:text-xl -ml-6 z-10" />
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(Number(e.target.value))}
              className="w-28 sm:w-36 text-primary p-1 sm:p-2 outline-none rounded-full bg-light text-right appearance-none pr-8 sm:pr-10 pl-3 sm:pl-4 ml-2 text-sm sm:text-base"
            >
              {provinces.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.faname}
                </option>
              ))}
            </select>
          </div>

          {/* ورودی سرچ */}
          <input
            type="text"
            placeholder="نام پزشک، تخصص یا بیماری..."
            className="w-full p-1 sm:p-2 text-gray-700 outline-none rounded-full text-right text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* آیکن سرچ یا لودینگ */}
          <div className="hidden sm:flex p-1 sm:p-2 pl-2 sm:pl-4 pr-3 sm:pr-6 flex-shrink-0">
            {isLoadingDoctors ? (
              <AiOutlineLoading3Quarters className="h-5 w-5 sm:h-6 sm:w-6 text-primary animate-spin" />
            ) : (
              <HiOutlineSearch className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            )}
          </div>
        </div>

        {/* Search Results */}
        {searchTerm.trim() !== "" && (
          <div className="absolute z-20 bg-white shadow-xl left-0 right-0 mt-2 rounded-xl border border-gray-200 max-h-80 overflow-y-auto">
            {filteredResults.length > 0 ? (
              <>
                <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h3 className="text-sm font-medium text-gray-700 text-right flex items-center justify-between">
                    <span>نتایج جستجو</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {filteredResults.length} نتیجه
                    </span>
                  </h3>
                </div>
                {filteredResults.map((doc) => (
                  <Link
                    key={doc.id}
                    to={`/doctors/${doc.id}`}
                    className="block p-4 hover:bg-gradient-to-l hover:from-blue-50 hover:to-transparent transition-all duration-200 border-b border-gray-50 last:border-b-0 group"
                  >
                    <div className="flex items-center gap-3">
                      {/* Doctor Avatar */}
                      <div className="flex-shrink-0 relative">
                        {doc.avatar ? (
                          <img
                            src={doc.avatar}
                            alt={doc.user.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-lg shadow-md">
                            {doc.user.name.charAt(0)}
                          </div>
                        )}
                        {doc.status === 'active' && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      {/* Doctor Info */}
                      <div className="flex-1 min-w-0 text-right">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                            {doc.user.name}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            doc.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {doc.status === 'active' ? 'فعال' : 'غیرفعال'}
                          </span>
                        </div>

                        <p className="text-sm text-blue-600 font-medium mt-1 group-hover:text-blue-800 transition-colors">
                          {getSpecialtyNames(doc.specialties)}
                        </p>

                        {doc.bio && (
                          <p className="text-xs text-gray-500 mt-1 overflow-hidden"
                             style={{
                               display: '-webkit-box',
                               WebkitLineClamp: 2,
                               WebkitBoxOrient: 'vertical' as const,
                             }}>
                            {doc.bio}
                          </p>
                        )}

                        {/* Clinic Info */}
                        {doc.clinics && doc.clinics.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <HiOutlineMap className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {doc.clinics[0].title || 'مطب'}
                              {doc.clinics.length > 1 && ` و ${doc.clinics.length - 1} مطب دیگر`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <HiOutlineSearch className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">نتیجه‌ای یافت نشد</h3>
                <p className="text-xs text-gray-500">
                  برای "{searchTerm}" نتیجه‌ای پیدا نکردیم. لطفاً عبارت دیگری جستجو کنید.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* نمایش تخصص‌ها */}
      <div className="w-full sm:w-[80%] mx-auto mt-4 px-4 sm:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2">
          {specialties.map((spec) => (
            <Link
              key={spec.id}
              to={`/specialties/${spec.id}`}
              className="flex flex-col items-center gap-4 justify-center p-3 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow"
            >
              <img
                src={spec.thumbnail || defaultSpecialtyImage}
                alt={spec.title}
                className="w-8 h-8 ml-2"
              />
              <span className="text-sm font-medium text-primary">
                {spec.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <div className="w-full sm:w-[80%] mx-auto relative flex items-center justify-center mt-4 px-4 sm:px-0">
        <div className="absolute top-1/2 w-full border-t border-white -translate-y-1/2"></div>
        <div className="relative z-10">
          <Button
            variant="solid"
            iconAlignment="start"
            size="sm"
            className="border-0 px-4"
          >
            مشاهده بیشتر...
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;