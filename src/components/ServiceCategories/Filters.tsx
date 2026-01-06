import React from 'react';
import type { Province, Specialty, Symptom } from '../../services/publicApi';

interface FiltersProps {
  provinces: Province[];
  specialties: Specialty[];
  symptoms?: Symptom[];
  selectedProvince: number | null;
  selectedSpecialty: number | null;
  selectedSymptom?: string | null;
  onProvinceChange: (provinceId: number | null) => void;
  onSpecialtyChange: (specialtyId: number | null) => void;
  onSymptomChange?: (symptom: string | null) => void;
}

const Filters: React.FC<FiltersProps> = ({
  provinces,
  specialties,
  symptoms = [],
  selectedProvince,
  selectedSpecialty,
  selectedSymptom,
  onProvinceChange,
  onSpecialtyChange,
  onSymptomChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Province Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          استان
        </label>
        <select
          value={selectedProvince || ''}
          onChange={(e) => onProvinceChange(e.target.value ? Number(e.target.value) : null)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-transparent text-right bg-white transition-all duration-200"
        >
          <option value="">همه استان‌ها</option>
          {provinces.map((province) => (
            <option key={province.id} value={province.id}>
              {province.faname}
            </option>
          ))}
        </select>
      </div>

      {/* Specialty Filter */}
      {specialties.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            تخصص
          </label>
          <select
            value={selectedSpecialty || ''}
            onChange={(e) => onSpecialtyChange(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-transparent text-right bg-white transition-all duration-200"
          >
            <option value="">همه تخصص‌ها</option>
            {specialties.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Symptoms/Diseases Filter */}
      {onSymptomChange && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            علائم و بیماری‌ها
          </label>
          <select
            value={selectedSymptom || ''}
            onChange={(e) => onSymptomChange(e.target.value || null)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-transparent text-right bg-white transition-all duration-200"
          >
            <option value="">انتخاب علامت یا بیماری</option>
            {symptoms.map((symptom) => (
              <option key={symptom.id} value={symptom.slug}>
                {symptom.title}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Filters;