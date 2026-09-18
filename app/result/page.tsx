"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();
  
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchFormulation = async () => {
      try {
        const payloadStr = sessionStorage.getItem("formylabLiveResults");
        if (!payloadStr) {
          setError("Data brief tidak ditemukan. Silakan isi form dari awal.");
          setLoading(false);
          return;
        }

        const payload = JSON.parse(payloadStr);

        const res = await fetch("/api/formulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        
        if (data.success && Array.isArray(data.candidates)) {
          setCandidates(data.candidates);
        } else {
          setError(data.error || "Gagal mendapatkan hasil racikan dari AI. Cek console untuk detailnya.");
        }
      } catch (err) {
        setError("Terjadi kesalahan pada server saat menghubungi AI.");
      } finally {
        setLoading(false);
      }
    };

    fetchFormulation();
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#cbf2d6] text-green-900 font-sans">
        <div className="animate-spin w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full mb-4"></div>
        <h2 className="text-xl font-bold">AI sedang meracik formula & mencari supplier...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#cbf2d6] p-8 font-sans">
        <div className="bg-white p-8 rounded-3xl text-center shadow-md max-w-md">
          <h2 className="text-red-500 text-2xl font-bold mb-4">Oops!</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => router.push("/formulate")} 
            className="mt-6 px-6 py-3 bg-[#234e42] text-white rounded-full font-bold w-full hover:bg-[#1a3a31] transition"
          >
            Kembali ke Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#cbf2d6] p-8 text-gray-800 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center mb-10 mt-6">
          <h1 className="text-3xl font-bold text-green-900 mb-3">Ranked Candidates & Risk Analysis</h1>
          <p className="text-green-800">
            AI merespons parameter & merekomendasikan supplier yang tervalidasi.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {Array.isArray(candidates) && candidates.map((cand) => {
            const isExp = expanded[cand.id];
            const mediumRiskCount = cand.ingredients.filter((i: any) => i.riskLevel === "Medium").length;
            const totalIngs = cand.ingredients.length;

            return (
              <div key={cand.id} className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-sm">
                
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                  <div className="flex flex-wrap items-center gap-4">
                    <h2 className="text-2xl font-bold">{cand.title}</h2>
                    <span className="bg-[#e8f5e9] text-green-800 px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap">
                      {cand.badge}
                    </span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <span className="border border-green-200 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium">Halal ✓</span>
                    <span className="border border-green-200 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium">Compatible ✓</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#f5ebe0]/40 p-5 rounded-2xl">
                    <div className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">Viscosity (Matched)</div>
                    <div className="font-semibold text-lg">{cand.viscosity}</div>
                  </div>
                  <div className="bg-[#f5ebe0]/40 p-5 rounded-2xl">
                    <div className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">pH</div>
                    <div className="font-semibold text-lg">{cand.ph}</div>
                  </div>
                  <div className="bg-[#f5ebe0]/40 p-5 rounded-2xl">
                    <div className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">Est. Cost</div>
                    <div className="font-semibold text-lg">{cand.estCost}</div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between border-y border-gray-100 py-5 mb-5 gap-4">
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 
                      ${cand.overallRisk.includes("Medium") ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                      <div className={`w-2 h-2 rounded-full ${cand.overallRisk.includes("Medium") ? "bg-orange-500" : "bg-green-500"}`}></div>
                      {cand.overallRisk} risk
                    </span>
                    <span className="text-gray-500 text-sm font-medium">
                      {totalIngs} ingredients · {mediumRiskCount} flagged medium risk
                    </span>
                  </div>
                  <button 
                    onClick={() => toggleExpand(cand.id)}
                    className="border border-gray-200 px-5 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
                  >
                    {isExp ? "Hide composition & risk ↑" : "View composition & risk ↓"}
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-yellow-600 text-sm italic font-medium">
                    ⚠️ {cand.riskSummaryText}
                  </p>
                  <div className="bg-[#f0fdf4] text-green-800 border border-green-100 p-5 rounded-2xl text-sm leading-relaxed">
                    <strong className="text-green-900 mr-1">✨ AI Observation:</strong> 
                    {cand.observationText}
                  </div>
                </div>

                {/* TABEL KOMPOSISI YANG DIPERBARUI DENGAN KOLOM SUPPLIER */}
                {isExp && (
                  <div className="mt-8 overflow-x-auto">
                    <h3 className="font-bold text-xs text-gray-400 tracking-widest mb-4 uppercase">Composition & Potential Risk Breakdown</h3>
                    <div className="min-w-[700px] w-full">
                      
                      {/* HEADER TABEL: Diubah jadi 4 Kolom */}
                      <div className="grid grid-cols-12 text-xs font-bold text-gray-400 mb-2 border-b pb-3">
                        <div className="col-span-4">INGREDIENT</div>
                        <div className="col-span-2">CONC. (%)</div>
                        <div className="col-span-3">RECOMMENDED SUPPLIER</div>
                        <div className="col-span-3">POTENTIAL RISK</div>
                      </div>
                      
                      {cand.ingredients.map((ing: any, idx: number) => (
                        <div key={idx} className="grid grid-cols-12 items-start py-4 border-b border-gray-50 last:border-0">
                          
                          <div className="col-span-4 pr-2">
                            <div className="font-bold text-gray-800 text-sm">{ing.name}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{ing.category}</div>
                          </div>
                          
                          <div className="col-span-2 font-bold text-gray-700 pt-0.5 text-sm">
                            {ing.conc}
                          </div>
                          
                          {/* KOLOM BARU: SUPPLIER INFO */}
                          <div className="col-span-3 pr-2 pt-0.5">
                            <div className="font-semibold text-gray-700 text-sm">{ing.supplier}</div>
                            {ing.isHalal && (
                              <div className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1">
                                ✓ Verified Halal
                              </div>
                            )}
                          </div>

                          <div className="col-span-3 pt-0.5">
                            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded font-bold mb-1.5
                              ${ing.riskLevel === "Medium" ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-700"}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${ing.riskLevel === "Medium" ? "bg-orange-500" : "bg-green-500"}`}></div>
                              {ing.riskLevel}
                            </span>
                            <div className="text-xs text-gray-500 leading-relaxed pr-2">{ing.riskNote}</div>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}