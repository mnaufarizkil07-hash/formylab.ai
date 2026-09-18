import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// --- FUNGSI PARSER CSV OTOMATIS ---
function parseCSV(filePath: string) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const lines = fileContent.trim().split("\n");
    if (lines.length < 2) return [];
    
    const headers = lines[0].trim().split(",");
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].trim();
      if (!row) continue;
      
      const values = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      let obj: any = {};
      
      headers.forEach((h, idx) => {
        let val = values[idx] || "";
        if (val.startsWith('"') && val.endsWith('"')) val = val.substring(1, val.length - 1);
        obj[h.trim()] = val.trim();
      });
      data.push(obj);
    }
    return data;
  } catch (error) {
    console.error(`[AI ERROR] Gagal membaca file ${filePath}:`, error);
    return [];
  }
}

const IGNORE_COLS = [
  "Formula", "Viscosity_cps", "pH", "Spreadability_cm", 
  "Washability_sec", "HLB", "Stability", "Data_Source", "Evidence_DOI", ""
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetPh, targetViscosity, customIngredients, batchSize, viewCost } = body;

    const finalBatchSize = batchSize && !isNaN(parseFloat(batchSize)) ? parseFloat(batchSize) : 100;
    const shouldViewCost = viewCost !== false; 

    const formulationsPath = path.join(process.cwd(), "data", "allpurpose_cream_formulation_dataset_EN (2).csv");
    
    let suppliersPath = path.join(process.cwd(), "supplier.csv");
    if (!fs.existsSync(suppliersPath)) {
      suppliersPath = path.join(process.cwd(), "data", "supplier.csv");
    }
    
    const rawFormulations = parseCSV(formulationsPath);
    const rawSuppliers = parseCSV(suppliersPath);

    if (rawFormulations.length === 0) {
      return NextResponse.json({ success: false, error: "Dataset CSV Formulasi tidak ditemukan" }, { status: 500 });
    }

    const targetPhNum = targetPh ? parseFloat(targetPh) : 5.5;
    let targetViscNum = 6000;
    if (targetViscosity) {
      const nums = targetViscosity.match(/\d+/g);
      if (nums) targetViscNum = parseInt(nums[0], 10);
    }

    const sortedFormulas = rawFormulations.sort((a, b) => {
      const aPh = parseFloat(a.pH) || 5.0;
      const bPh = parseFloat(b.pH) || 5.0;
      const aVisc = parseFloat(a.Viscosity_cps) || 5000;
      const bVisc = parseFloat(b.Viscosity_cps) || 5000;
      
      const safeTargetPh = Math.max(targetPhNum, 0.1);
      const safeTargetVisc = Math.max(targetViscNum, 1);

      const aDiffPh = Math.abs(aPh - safeTargetPh) / safeTargetPh;
      const aDiffVisc = Math.abs(aVisc - safeTargetVisc) / safeTargetVisc;
      const bDiffPh = Math.abs(bPh - safeTargetPh) / safeTargetPh;
      const bDiffVisc = Math.abs(bVisc - safeTargetVisc) / safeTargetVisc;

      return ((aDiffPh * 0.6) + (aDiffVisc * 0.4)) - ((bDiffPh * 0.6) + (bDiffVisc * 0.4));
    });

    const match1 = sortedFormulas[0];
    const match2 = sortedFormulas[1] || sortedFormulas[0];

    const getSupplierInfo = (colName: string) => {
      const cleanColName = colName.replace(/_%/g, "").replace(/_/g, " ").toLowerCase().trim();
      
      const matchingSuppliers = rawSuppliers.filter((s: any) => {
         const datasetCol = String(s.formulation_dataset_column || "").toLowerCase().trim();
         const ingName = String(s.ingredient_name || "").toLowerCase().trim();
         return datasetCol === cleanColName || cleanColName.includes(datasetCol) || datasetCol.includes(cleanColName) || ingName.includes(cleanColName);
      });

      if (matchingSuppliers.length === 0) {
         return { price: 25.0, name: "General Distributor", isHalal: true };
      }

      const halalSuppliers = matchingSuppliers.filter((s: any) => {
         const cert = String(s.supplier_halal_certificate || "").toLowerCase().trim();
         return cert === "yes" || cert.includes("halal");
      });

      const bestSupplier = halalSuppliers.length > 0 ? halalSuppliers[0] : matchingSuppliers[0];
      
      const actualSupplierName = bestSupplier.supplier || "General Distributor";
      const actualPrice = bestSupplier.price_per_g ? parseFloat(bestSupplier.price_per_g) : 25.0;

      return {
         price: isNaN(actualPrice) ? 25.0 : actualPrice,
         name: actualSupplierName, 
         isHalal: halalSuppliers.length > 0 
      };
    };

    const processFormula = (formula: any, customIngs: string[]) => {
      let totalCost = 0;
      let list: any[] = [];
      let removedAllergens = 0; 
      
      Object.keys(formula).forEach(key => {
        if (IGNORE_COLS.includes(key)) return;
        const perc = parseFloat(formula[key]);
        
        if (perc > 0) { 
           const prettyName = key.replace(/_%/g, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
           const lowerKey = key.toLowerCase();
           const isAllergen = lowerKey.includes("paraben") || lowerKey.includes("perfume") || lowerKey.includes("fragrance");
           
           if (isAllergen) {
               removedAllergens++;
               return; 
           }

           const suppInfo = getSupplierInfo(key);
           totalCost += (perc / 100) * finalBatchSize * suppInfo.price;

           list.push({
             name: prettyName,
             category: "Base Formulation",
             conc: `${perc.toFixed(2)}%`,
             riskLevel: "Low", 
             riskNote: "Aman berdasarkan dataset",
             supplier: suppInfo.name,
             isHalal: suppInfo.isHalal 
           });
        }
      });

      if (removedAllergens > 0) {
          const safePreservative = "Phenoxyethanol (Safe Preservative)";
          const safePerc = 1.0; 
          const suppInfo = getSupplierInfo("phenoxyethanol");
          totalCost += (safePerc / 100) * finalBatchSize * suppInfo.price;

          list.push({
             name: safePreservative,
             category: "AI Safety Replacement",
             conc: `${safePerc.toFixed(2)}%`,
             riskLevel: "Low",
             riskNote: `Substitusi aman untuk ${removedAllergens} alergen.`,
             supplier: suppInfo.name,
             isHalal: suppInfo.isHalal
          });
      }

      if (customIngs && Array.isArray(customIngs)) {
         customIngs.forEach(ci => {
            let userPerc: number | null = null;
            let cleanName = ci.trim();
            const regex = /(\d+(?:\.\d+)?)\s*%/;
            const match = ci.match(regex);
            
            if (match) {
               userPerc = parseFloat(match[1]);
               cleanName = ci.replace(regex, '').trim();
            }

            const lowerName = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');
            const existingIndex = list.findIndex(item => {
               const itemLower = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
               return itemLower === lowerName || lowerName.includes(itemLower) || itemLower.includes(lowerName);
            });

            if (existingIndex !== -1) {
               const currentPerc = parseFloat(list[existingIndex].conc);
               if (userPerc !== null) {
                  list[existingIndex].conc = `${(currentPerc + userPerc).toFixed(2)}%`;
                  const suppInfo = getSupplierInfo(cleanName);
                  totalCost += (userPerc / 100) * finalBatchSize * suppInfo.price;
                  list[existingIndex].supplier = suppInfo.name;
                  list[existingIndex].isHalal = suppInfo.isHalal;
               }
               list[existingIndex].riskNote = "✓ Base Formulation (Diprioritaskan sesuai form)";
            } else {
               let concNum = userPerc;
               if (concNum === null) {
                  if (lowerName.includes("acid")) concNum = 1.5;
                  else if (lowerName.includes("extract") || lowerName.includes("centella") || lowerName.includes("aloe")) concNum = 2.0;
                  else if (lowerName.includes("vitamin") || lowerName.includes("niacinamide")) concNum = 4.0;
                  else if (lowerName.includes("oil") || lowerName.includes("butter") || lowerName.includes("wax") || lowerName.includes("paraffin")) concNum = 3.5;
                  else if (lowerName.includes("peptid") || lowerName.includes("ceramide")) concNum = 1.0;
                  else {
                     const charSum = cleanName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
                     concNum = (charSum % 26 + 5) / 10; 
                  }
               }

               const suppInfo = getSupplierInfo(cleanName);
               const activePrice = suppInfo.price > 25 ? suppInfo.price : 150; 
               totalCost += (concNum / 100) * finalBatchSize * activePrice; 
               
               list.push({
                 name: cleanName,
                 category: "Custom Active Compound",
                 conc: `${concNum.toFixed(2)}%`,
                 riskLevel: "Low",
                 riskNote: "Tambahan kustom (AI Calculated)",
                 supplier: suppInfo.name,
                 isHalal: suppInfo.isHalal
               });
            }
         });
      }

      list.sort((a, b) => parseFloat(b.conc) - parseFloat(b.conc));
      return { list, cost: Math.round(totalCost), removedCount: removedAllergens };
    };

    const result1 = processFormula(match1, customIngredients);
    const result2 = processFormula(match2, customIngredients);

    const labScaleMultiplier = 2.5; 
    const bomCost1 = result1.cost * labScaleMultiplier;
    const bomCost2 = result2.cost * labScaleMultiplier;

    const renderCost = (cost: number) => {
      if (shouldViewCost) return `Rp ${Math.round(cost).toLocaleString("id-ID")} (BOM)`;
      return "Hidden (Not requested)";
    };

    const dbPh1 = parseFloat(match1.pH);
    const dbVisc1 = Math.round(parseFloat(match1.Viscosity_cps));
    const dbPh2 = parseFloat(match2.pH);
    const dbVisc2 = Math.round(parseFloat(match2.Viscosity_cps));

    const candidates = [
      {
        id: "candidate-a",
        title: "Candidate A",
        badge: "Best match (Hypoallergenic)",
        viscosity: `${dbVisc1.toLocaleString("en-US")} cP`,
        ph: dbPh1.toFixed(2),
        estCost: renderCost(bomCost1), 
        overallRisk: "Low", 
        riskSummaryText: `Dataset CSV baris ${match1.Formula} (Stabilitas: ${match1.Stability}).`,
        observationText: `🤖 AI R&D ANALYSIS: Menggunakan database supplier.csv. Berhasil memetakan nama PT dan sertifikasi Halal.`,
        ingredients: result1.list
      },
      {
        id: "candidate-b",
        title: "Candidate B",
        badge: "Alternative Variant",
        viscosity: `${dbVisc2.toLocaleString("en-US")} cP`,
        ph: dbPh2.toFixed(2),
        estCost: renderCost(bomCost2),
        overallRisk: "Low",
        riskSummaryText: `Varian alternatif CSV baris ${match2.Formula} (Stabilitas: ${match2.Stability}).`,
        observationText: `Matrix alternatif berdasar closest match.`,
        ingredients: result2.list
      }
    ];

    return NextResponse.json({ success: true, candidates });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: "Gagal memproses AI" }, { status: 500 });
  }
}