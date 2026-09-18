"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LibraryPage() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/library")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIngredients(data.items);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#cbf2d6] p-8 text-gray-800 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Tombol Kembali & Header */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => router.push("/formulate")}
            className="px-5 py-2.5 bg-white text-green-900 rounded-xl font-bold shadow-sm hover:bg-green-50 transition"
          >
            ← Back to Formulate
          </button>
          <span className="bg-white/80 text-green-900 px-4 py-2 rounded-full font-semibold text-sm">
            Total: {ingredients.length} ingredients on file
          </span>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Ingredient Library</h1>
          <p className="text-gray-600 mb-6">Daftar lengkap bahan baku aktif & dasar beserta PT Supplier dan status sertifikasi Halalnya.</p>

          {loading ? (
            <div className="py-20 text-center font-semibold text-green-800">Memuat data library...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-xs font-bold text-gray-400 uppercase">
                    <th className="pb-3">Ingredient Name</th>
                    <th className="pb-3">Grade</th>
                    <th className="pb-3">Recommended Supplier</th>
                    <th className="pb-3">Est. Price / g</th>
                    <th className="pb-3">Halal Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ingredients.map((item, idx) => (
                    <tr key={idx} className="hover:bg-green-50/50 transition">
                      <td className="py-4 font-bold text-gray-800">{item.name}</td>
                      <td className="py-4 text-sm text-gray-600">{item.grade}</td>
                      <td className="py-4 font-medium text-gray-700">{item.supplier}</td>
                      <td className="py-4 text-sm font-semibold text-green-800">{item.price}</td>
                      <td className="py-4">
                        {item.isHalal ? (
                          <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold">
                            ✓ Verified Halal
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium">
                            Standard
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}