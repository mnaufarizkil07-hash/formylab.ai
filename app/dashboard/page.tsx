"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#cbf2d6] font-sans p-8 text-gray-800 flex flex-col items-center">
      
      {/* HEADER DASHBOARD */}
      <div className="text-center max-w-2xl mb-12 mt-6">
        <h1 className="text-4xl font-bold mb-3 text-green-900">formylab.ai Dashboard</h1>
        <p className="text-green-800/80">
          Professional AI-driven skincare formulation tool for lab prototyping and R&D analysis.
        </p>
      </div>

      {/* CONTAINER MENU / KARTU UTAMA */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* KARTU 1: START NEW FORMULATION */}
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="bg-green-100 text-green-800 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl mb-4">
              🧪
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">New Formulation</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Mulai merancang kandidat krim kosmetik baru berdasarkan target spesifik kulit, parameter pH, viskositas, dan batch size lab.
            </p>
          </div>
          <button 
            onClick={() => router.push("/formulate")}
            className="w-full py-3.5 bg-[#234e42] text-white rounded-2xl font-bold hover:bg-[#1a3a31] transition shadow-sm text-center"
          >
            Start Formulation ✨
          </button>
        </div>

        {/* KARTU 2: INGREDIENT LIBRARY (Sesuai Screenshot Lu) */}
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="bg-[#e8f5e9] text-green-800 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl mb-4">
              📚
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ingredient Library</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-1">
              13 ingredients on file
            </p>
            <p className="text-xs text-gray-400 mb-6">
              Database aktif bahan baku dasar & aktif beserta verifikasi PT Supplier & sertifikasi Halal LPPOM MUI.
            </p>
          </div>
          <button 
            onClick={() => router.push("/library")}
            className="w-full py-3.5 bg-[#f5f5dc] text-gray-800 border border-yellow-200 rounded-2xl font-bold hover:bg-[#f0f0c9] transition shadow-sm text-center"
          >
            View Library
          </button>
        </div>

      </div>

      {/* FOOTER KECIL */}
      <div className="mt-16 text-center text-xs text-green-900/60 font-medium">
        formylab.ai · Powered by Advanced R&D Chemist Intelligence Engine
      </div>

    </div>
  );
}