"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FormulatePage() {
  const router = useRouter();

  // State untuk form Product Target (Kiri)
  const [targetSkin, setTargetSkin] = useState("Rosacea");
  const [productType, setProductType] = useState("");
  const [targetPh, setTargetPh] = useState("");
  const [targetViscosity, setTargetViscosity] = useState("");
  const [batchSize, setBatchSize] = useState("100"); 
  
  // State untuk Custom Ingredients
  const [ingredientInput, setIngredientInput] = useState("");
  const [customIngredients, setCustomIngredients] = useState<string[]>([]);

  // State untuk Priorities (Kanan) - viewCost dihapus dari UI
  const [useAvailable, setUseAvailable] = useState(true);
  const [checkCompat, setCheckCompat] = useState(true);

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredientInput.trim() && !customIngredients.includes(ingredientInput.trim())) {
      setCustomIngredients([...customIngredients, ingredientInput.trim()]);
      setIngredientInput("");
    }
  };

  const handleRemoveIngredient = (ing: string) => {
    setCustomIngredients(customIngredients.filter((item) => item !== ing));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalCustomIngs = [...customIngredients];
    if (ingredientInput.trim() && !finalCustomIngs.includes(ingredientInput.trim())) {
      finalCustomIngs.push(ingredientInput.trim());
    }

    // Payload dikirim ke backend
    const payload = {
      targetSkin,
      productType,
      targetPh,
      targetViscosity,
      batchSize,
      customIngredients: finalCustomIngs, 
      viewCost: true, // Di-hardcode true agar harga SELALU tampil di halaman Result
      priorities: {
        useAvailable,
        checkCompat,
      },
    };

    sessionStorage.setItem("formylabLiveResults", JSON.stringify(payload));
    
    router.push("/result");
  };

  return (
    <div className="min-h-screen bg-[#cbf2d6] font-sans p-8 text-gray-800 flex flex-col items-center">
      {/* HEADER */}
      <div className="text-center max-w-2xl mb-10">
        <h1 className="text-4xl font-bold mb-3 text-green-900">Start a new formulation</h1>
        <p className="text-green-800/80">
          Set your product target, then your priorities. formylab.ai ranks candidates against both.
        </p>
      </div>

      {/* FORM CONTAINER */}
      <form onSubmit={handleSubmit} className="w-full max-w-5xl flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          
          {/* KOTAK KIRI: PRODUCT TARGET */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#e8f5e9] text-green-800 font-bold w-8 h-8 rounded-full flex items-center justify-center">1</span>
              <h2 className="text-xl font-semibold">Product target</h2>
            </div>

            <div className="space-y-5 flex-1">
              <div>
                <label className="block text-sm font-medium mb-1 text-red-500"></label>
                <select 
                  value={targetSkin} 
                  onChange={(e) => setTargetSkin(e.target.value)}
                  className="w-full p-3 rounded-xl bg-green-50 border border-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="Rosacea">Rosacea</option>
                  <option value="Acne Prone">Acne Prone</option>
                  <option value="Sensitive">Sensitive</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Product type</label>
                <input 
                  type="text" 
                  placeholder="e.g. Facial moisturizer..." 
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#f5ebe0]/40 border-none focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Target pH</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 5.5" 
                    value={targetPh}
                    onChange={(e) => setTargetPh(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#f5ebe0]/40 border-none focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Target viscosity</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 6200 cP" 
                    value={targetViscosity}
                    onChange={(e) => setTargetViscosity(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#f5ebe0]/40 border-none focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Batch (gram)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 100" 
                    value={batchSize}
                    onChange={(e) => setBatchSize(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#f5ebe0]/40 border-none focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ingredients (Ketik bahan kustom di sini)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. Centella Asiatica 2%" 
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddIngredient(e) }}
                    className="flex-1 p-3 rounded-xl bg-[#f5ebe0]/40 border-none focus:outline-none"
                  />
                  <button 
                    type="button"
                    onClick={handleAddIngredient}
                    className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    Add
                  </button>
                </div>
                {customIngredients.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {customIngredients.map((ing, idx) => (
                      <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {ing}
                        <button type="button" onClick={() => handleRemoveIngredient(ing)} className="text-green-600 hover:text-green-900">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 italic">
                * All raw materials and ingredients are verified Halal compliant.
              </p>
            </div>
          </div>

          {/* KOTAK KANAN: PRIORITIES */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-sm h-fit">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#e8f5e9] text-green-800 font-bold w-8 h-8 rounded-full flex items-center justify-center">2</span>
              <h2 className="text-xl font-semibold">Set your priorities</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition">
                <input 
                  type="checkbox" 
                  checked={useAvailable} 
                  onChange={(e) => setUseAvailable(e.target.checked)} 
                  className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                />
                <span className="font-medium text-gray-700">Use available ingredients only</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition">
                <input 
                  type="checkbox" 
                  checked={checkCompat} 
                  onChange={(e) => setCheckCompat(e.target.checked)} 
                  className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                />
                <span className="font-medium text-gray-700">Check ingredient compatibility</span>
              </label>
            </div>
          </div>
          
        </div>

        {/* TOMBOL SUBMIT */}
        <button 
          type="submit"
          className="mt-10 px-12 py-4 bg-[#234e42] text-white rounded-full font-bold text-lg hover:bg-[#1a3a31] transition shadow-lg flex items-center gap-2 w-full max-w-2xl justify-center"
        >
          Rank candidates ✨
        </button>
      </form>
    </div>
  );
}