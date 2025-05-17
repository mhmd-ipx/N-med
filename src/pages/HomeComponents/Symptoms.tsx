import { getsymptoms } from '../../services/api';
import type { symptoms } from '../../types/types';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SymptomsSection = () => {
  const [symptoms, setSymptoms] = useState<symptoms[]>([]);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const data = await getsymptoms();
        setSymptoms(data);
      } catch (error) {
        console.error("Error fetching symptoms:", error);
      }
    };
    fetchSymptoms();
  }, []);

  return (
    <div className="max-w-[1300px] mx-auto ">
      <h2 className="font-bold text-xl">علائم و بیماری ها</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
        {symptoms.map((symptom) => (
        <Link
            key={symptom.slug}
            to={`/specialties/${symptom.slug}`}
        >
            <div key={symptom.id} className="border border-light rounded-xl p-4 text-center hover:bg-primary/10 bg-transparent transition-colors">
                <img src={symptom.imageUrl} alt={symptom.name} className="w-16 h-16 mx-auto mb-2" />
                <p className="text-sm text-blue-800">{symptom.name}</p>
            </div>
        </Link>
        ))}
      </div>
    </div>
  );
};

export default SymptomsSection;