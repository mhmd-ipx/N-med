import { useEffect, useState } from "react";
import { HiOutlineMap, HiOutlineSearch } from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getProvinces, getDoctors, getSpecialties } from '../../../services/publicApi';
import type { Province, Doctor, Specialty, DoctorsResponse } from '../../../services/publicApi';
import { Link } from "react-router-dom";
import Button from '../../ui/Button';

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
      // فیلتر بر اساس استان (در صورت انتخاب همه استان‌ها، این شرط همیشه true است)
      const hasMatchingClinic = selectedProvince === 0 || doc.clinics.some(clinic =>
        clinic.province_id === selectedProvince
      );

      if (!hasMatchingClinic) return false;

      // جستجو بر اساس نام پزشک یا تخصص
      const nameMatch = doc.user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const specialtyMatch = doc.specialties?.toLowerCase().includes(searchTerm.toLowerCase());

      return nameMatch || specialtyMatch;
    });

    setFilteredResults(results);
  }, [searchTerm, selectedProvince, doctors]);

  const getSpecialtyNames = (specialties: string | null): string => {
    return specialties || "بدون تخصص";
  };

  return (
    <div className="relative w-full mx-auto">
      <div className="relative w-[80%] mx-auto">
        <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm -mt-5">
          {/* انتخاب استان */}
          <div className="flex items-center p-2 pr-4">
            <HiOutlineMap className="text-primary text-xl -ml-6 z-10" />
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(Number(e.target.value))}
              className="text-primary p-2 outline-none rounded-full bg-light text-right appearance-none pr-10 pl-4 ml-2"
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
            className="flex-1 p-2 text-gray-700 outline-none rounded-full text-right"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* آیکن سرچ یا لودینگ */}
          <div className="p-2 pl-4 pr-6">
            {isLoadingDoctors ? (
              <AiOutlineLoading3Quarters className="h-6 w-6 text-primary animate-spin" />
            ) : (
              <HiOutlineSearch className="h-6 w-6 text-primary" />
            )}
          </div>
        </div>

        {filteredResults.length > 0 && (
          <ul className="absolute z-20 bg-white shadow-lg left-0 right-0 mt-2 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
            {filteredResults.map((doc) => (
              <li
                key={doc.id}
                className="p-2 text-right hover:bg-gray-100 cursor-pointer"
              >
                <Link to={`/doctors/${doc.id}`}>
                  {doc.user.name} -{" "}
                  <span className="text-sm text-gray-500">
                    {getSpecialtyNames(doc.specialties)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* نمایش تخصص‌ها */}
      <div className="w-[80%] mx-auto mt-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {specialties.map((spec) => (
            <Link
              key={spec.id}
              to={`/specialties/${spec.id}`}
              className="flex flex-col items-center gap-4 justify-center p-3 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow"
            >
              {spec.imageUrl && (
                <img
                  src={spec.imageUrl}
                  alt={spec.name}
                  className="w-8 h-8 ml-2"
                />
              )}
              <span className="text-sm font-medium text-primary">
                {spec.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <div className="w-[80%] mx-auto relative flex items-center justify-center mt-4">
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