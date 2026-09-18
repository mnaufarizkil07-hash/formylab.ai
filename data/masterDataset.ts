export interface ResearchFormula {
  formulaId: string;
  system: string;
  aqua: number;
  glycerin: number;
  propyleneGlycol: number;
  aloeVera: number;
  carbopol: number;
  mineralOil: number;
  cetylAlcohol: number;
  viscositycP: number;
  pH: number;
  stability: string;
}

export interface SupplierItem {
  ingredientId: string;
  ingredientName: string;
  grade: string;
  supplier: string;
  supplierLocation: string;
  pricePerG: number;
  stock: "available" | "unavailable";
  leadTimeDays: number;
  halalCertified: "Yes" | "No";
}

// Data dari kalkulasi_cost_F0004.csv & moisturizer_formulation_dataset_EN.csv
export const MASTER_FORMULAS: ResearchFormula[] = [
  { formulaId: "F0004", system: "A", aqua: 63.275, glycerin: 3.0, propyleneGlycol: 1.0, aloeVera: 2.0, carbopol: 0.5, mineralOil: 10.0, cetylAlcohol: 4.5, viscositycP: 8427520, pH: 5.2, stability: "Stable" },
  { formulaId: "F0005", system: "A", aqua: 76.825, glycerin: 3.0, propyleneGlycol: 1.0, aloeVera: 2.0, carbopol: 0.2, mineralOil: 5.0, cetylAlcohol: 2.25, viscositycP: 312260, pH: 5.25, stability: "Stable" },
  { formulaId: "F0006", system: "B", aqua: 46.185, glycerin: 0.0, propyleneGlycol: 3.69, aloeVera: 0.0, carbopol: 0.0, mineralOil: 0.0, cetylAlcohol: 0.0, viscositycP: 2670, pH: 6.1, stability: "Stable" },
  { formulaId: "F0007", system: "B", aqua: 47.054, glycerin: 0.0, propyleneGlycol: 3.76, aloeVera: 0.0, carbopol: 0.0, mineralOil: 0.0, cetylAlcohol: 0.0, viscositycP: 2639, pH: 5.8, stability: "Stable" }
];

// Data dari raw_material_supplier_dataset_EN.csv
export const MASTER_SUPPLIERS: SupplierItem[] = [
  { ingredientId: "ING-001", ingredientName: "Purified water (aqua)", grade: "Pharma", supplier: "PT Otsuka Indonesia", supplierLocation: "Domestic - Malang", pricePerG: 4.8, stock: "available", leadTimeDays: 24, halalCertified: "Yes" },
  { ingredientId: "ING-002", ingredientName: "Disodium EDTA", grade: "Cosmetic", supplier: "BASF", supplierLocation: "Import - Germany", pricePerG: 85.0, stock: "available", leadTimeDays: 17, halalCertified: "Yes" },
  { ingredientId: "ING-003", ingredientName: "Glycerin", grade: "Pharma", supplier: "PT SMART Tbk", supplierLocation: "Domestic - Jakarta", pricePerG: 47.0, stock: "available", leadTimeDays: 5, halalCertified: "Yes" },
  { ingredientId: "ING-004", ingredientName: "Acrylic acid copolymer", grade: "Cosmetic", supplier: "Samyang KCI Corporation", supplierLocation: "Import - South Korea", pricePerG: 495.0, stock: "available", leadTimeDays: 7, halalCertified: "Yes" },
  { ingredientId: "ING-005", ingredientName: "Propylene glycol", grade: "Pharma", supplier: "The Dow Chemical Company", supplierLocation: "Import - United States", pricePerG: 42.2, stock: "available", leadTimeDays: 4, halalCertified: "Yes" }
];